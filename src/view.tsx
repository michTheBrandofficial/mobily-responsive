import { ErrorMatcher } from "@/lib/error-matcher";
import { handleDirCreation } from "@/lib/file-handle";
import {
  blobToBinary,
  entries,
  findAndPipe,
  prefixWithSlash,
  px,
  sleep,
} from "@/lib/utils";
import {
  BaseDirectory,
  exists,
  readTextFile,
  writeBinaryFile,
  writeFile,
} from "@tauri-apps/api/fs";
import {
  dataDir,
  FSOptions,
  iframeRef,
  setDeviceFrameHeightClass,
} from "./constants";
import { DEVICE_MAPPING } from "./device-mapping";
import { useBasePhoneConfig } from "./stores/base-phone-config";
import { useDevice } from "./stores/device";
import { useDeviceScreen } from "./stores/device-screen.context";
import { useDeviceSettings } from "./stores/device-settings";
import { useIphoneConfig } from "./stores/iphone-config";
import TopNavbar from "@/components/top-navbar";
import MinimizeFullscreen from "@/components/icons/minimize";
import { useFullscreen } from "./stores/fullscreen";
import { FC, useEffect, useState } from "react";
import { IframeSrcContext } from "./stores/iframe-src.context";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

const [safeAreaInset, setSafeAreaInset] = signal<string>(px(0));

const fetchIconBlob = async (
  icons: App.WebManifest["icons"],
  iframeOrigin: string,
) => {
  return new Promise<Blob>((resolve, reject) => {
    const icon192or512 = icons.find((value) => {
      return ["192x192", "512x512", "180x180"].includes(value.sizes);
    })?.src;
    if (icon192or512)
      fetch(`${iframeOrigin}${prefixWithSlash(icon192or512)}`).then(
        async (val) => {
          if (val.ok) {
            resolve(await val.blob());
          }
        },
      );
    else reject(`No app icon found for ${iframeOrigin}`);
  });
};

const storeAppHomeScreenData = async (
  name: string,
  blob: Blob,
  origin: string,
) => {
  // unique name using the short_name from the webmanifest combined with a base64 string formed from the origin
  const iconFileName = `${name.replace(" ", "")}-${btoa(origin).replace(
    /=/g,
    "",
  )}`;
  const iconFilePath = `${dataDir}/AppIcons/${iconFileName}.png` as const;
  const binary = await blobToBinary(blob);
  await writeBinaryFile(
    {
      contents: binary,
      path: iconFilePath,
    },
    FSOptions,
  );
  const iconsJsonFilePath = `${dataDir}/icons.json`;
  if (await exists(iconsJsonFilePath, FSOptions)) {
    const jsonFile = await readTextFile(iconsJsonFilePath, FSOptions);
    const fileAsJsonObject: App.HomeScreenIconMapping = JSON.parse(jsonFile);
    if (iconFileName in fileAsJsonObject) return;
    else {
      fileAsJsonObject[iconFileName] = {
        name,
        icon: iconFilePath,
        origin,
      };
      await writeFile(
        {
          contents: JSON.stringify(fileAsJsonObject),
          path: `${dataDir}/icons.json`,
        },
        FSOptions,
      );
    }
  } else {
    await writeFile(
      {
        contents: JSON.stringify({
          [iconFileName]: {
            name,
            icon: iconFilePath,
            origin,
          },
        }),
        path: `${dataDir}/icons.json`,
      },
      {
        dir: BaseDirectory.AppLocalData,
      },
    );
  }
};

const setupPWAConfig = (src: string | null) => {
  if (!src) return;
  const { origin: iframeOrigin } = new URL(src);
  fetch(`${iframeOrigin}/manifest.json`)
    .then(async (val) => {
      // webmanifest data
      if (!val.ok) return;
      const manifest: App.WebManifest = await val.json();
      if (manifest) {
        const { display, theme_color, short_name, icons } = manifest;
        const isFullScreen = display === "fullscreen";
        if (isFullScreen) {
          const { basePhoneConfig, setBasePhoneConfig } = useBasePhoneConfig();
          const { iphoneConfig, setIphoneConfig } = useIphoneConfig();
          const {
            device: { value },
          } = useDevice();
          setSafeAreaInset((prev) => {
            const { safeAreaInset } = value.includes("iphone")
              ? iphoneConfig
              : basePhoneConfig;
            return parseFloat(safeAreaInset) === 0 ? prev : safeAreaInset;
          });
          setBasePhoneConfig((prev) => {
            prev.safeAreaInset = "0";
            return prev;
          });
          setIphoneConfig((prev) => {
            prev.safeAreaInset = "0";
            return prev;
          });
        }
        useDeviceSettings().setDeviceSettings({
          theme_color:
            isFullScreen ||
            useDeviceScreen().deviceScreen.value === "home-screen"
              ? "transparent"
              : theme_color || "white",
        });
        const icon_blob = await fetchIconBlob(icons, iframeOrigin)
          .then((blob) => blob)
          .catch((err) => console.warn(err));
        if (icon_blob)
          storeAppHomeScreenData(short_name, icon_blob, iframeOrigin);
      }
    })
    .catch((err) => {
      ErrorMatcher.use(err).match(TypeError, () => {
        console.log(err);
      });
    });
};

const Application: FC = () => {
  const [iframeSrc, setIframeSrc] = useState("");
  const { deviceScreen } = useDeviceScreen();
  const { setDeviceSettings } = useDeviceSettings();
  const { isFullscreen, setIsFullscreen } = useFullscreen();
  const { device } = useDevice();
  // setup data dir if it is not created;
  useEffect(() => {
    handleDirCreation();
  }, []);
  useEffect(() => {
    const src = iframeSrc;
    if (!src) return;
    localStorage.setItem("iframeSrc", src);
    setupPWAConfig(src);
  }, [iframeSrc]);
  useEffect(() => {
    if (deviceScreen === "home-screen") {
      setIframeSrc('');
      (async () => {
        await sleep(400);
        setDeviceSettings((p) => {
          p.theme_color = "white";
          return p;
        });
      })();
    }
  }, [deviceScreen]);
  useEffect(() => {
    (async () => {
      await sleep(1000);
      const message = {
        type: "mobily-responsive-safeAreaInset",
        safeAreaInsetTop: safeAreaInset,
      };
      if (deviceScreen === "app-screen")
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify(message),
          new URL(iframeSrc).origin,
        );
    })();
  }, [iframeSrc]);
  async function refetchFrame() {
    useDeviceScreen().setDeviceScreen("home-screen");
    await sleep(1000);
    setupPWAConfig(iframeSrc);
  }
  useEffect(() => {
    refetchFrame();
  }, [device]);

  return (
    <IframeSrcContext.Provider
      value={{
        src: iframeSrc,
        setSrc: setIframeSrc,
      }}
    >
      <section
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: px(12),
          paddingInline: px(0),
          position: "relative",
        }}
      >
        <section className="tws-h-screen tws-w-fit tws-pl-0 tws-flex tws-gap-y-1 tws-flex-col tws-items-center tws-justify-between ">
          <TopNavbar iframeSrc={iframeSrc} />
          <div className="tws-flex-grow">
            {findAndPipe(
              entries(
                DEVICE_MAPPING as Helpers.DeepMutable<typeof DEVICE_MAPPING>,
              ),
              ([deviceName]) => deviceName === device,
              (device) => {
                const [_name, config] = device;
                const DeviceComponent = config.component;
                return <DeviceComponent />;
              },
            )}
          </div>
          <motion.button
            onTap={() => {
              setIsFullscreen(false);
              // go back to normal height
              setDeviceFrameHeightClass(" tws-max-h-[93.6vh] ");
            }}
            className={cn(
              `tws-p-2 tws-border-[#44433E] tws-bg-[#474844] tws-rounded-full tws-absolute tws-bottom-1 tws-right-2 tws-z-[1000000000] `,
              {
                'tws-hidden': !isFullscreen
              },
            )}
          >
            <MinimizeFullscreen width={12} height={12} fill="white" />
          </motion.button>
        </section>
      </section>
    </IframeSrcContext.Provider>
  );
};

const View = () => {
  const [deviceScreen, setDeviceScreen] = useState<'home-screen' | 'app-screen'>('home-screen');

  return (
    <DeviceContext.Provider
      value={{
        device: device,
        setDevice: setDevice,
      }}
    >
      <Application />
    </DeviceContext.Provider>
  );
};

export default View;
