import MinimizeFullscreen from "@/components/icons/minimize";
import TopNavbar from "@/components/top-navbar";
import { Button } from "@/components/ui/buttons";
import { cn } from "@/lib/cn";
import { ErrorMatcher } from "@/lib/error-matcher";
import { handleDirCreation } from "@/lib/file-handle";
import { pipe } from "@/lib/pipe";
import {
    blobToBinary,
    iife,
    prefixWithSlash,
    px,
    sleep
} from "@/lib/utils";
import {
    BaseDirectory,
    exists,
    readTextFile,
    writeBinaryFile,
    writeFile,
} from "@tauri-apps/api/fs";
import { err, ok, Result } from "neverthrow";
import {
    Dispatch,
    FC,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { dataDir, FSOptions, useDeviceFrameHeight } from "./constants";
import { DEVICE_MAPPING } from "./device-mapping";
import { useBasePhoneConfig } from "./stores/base-phone-config";
import { useDeviceScreen } from "./stores/device-screen";
import { useDeviceSettings } from "./stores/device-settings";
import { useFullscreen } from "./stores/fullscreen";
import { IframeRefContext } from "./stores/iframe-ref";
import { IframeSrcContext } from "./stores/iframe-src";
import { useIphoneConfig } from "./stores/iphone-config";
import { useLocalStorage } from "./stores/local-storage";

/**
 * @dev fetches icons to save to storage and render on screen.
 */
const fetchIconBlob = async (
  icons: App.WebManifest["icons"],
  iframeOrigin: string,
): Promise<Result<Blob, App.DisplayableError>> => {
  const result = pipe(
    icons.find((value) => {
      return ["192x192", "512x512", "180x180"].includes(value.sizes);
    })?.src,
    async (icon192or512) => {
      if (icon192or512) {
        const iconBlob = await fetch(
          `${iframeOrigin}${prefixWithSlash(icon192or512)}`,
        )
          .then(async (val) => ok(await val.blob()))
          .catch((_) =>
            err({
              message: "App Icon not found",
            } satisfies App.DisplayableError),
          );
        return iconBlob;
      } else
        return err({
          message: "App Icon not found",
        } satisfies App.DisplayableError);
    },
  );
  return result;
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

const setupPWAConfig = (
  src: string | null,
  setSafeAreaInset: Dispatch<SetStateAction<string>>,
) => {
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
            storage: { lastUsedDevice: device },
          } = useLocalStorage();
          setSafeAreaInset((prev) => {
            const { safeAreaInset } = device.includes("iphone")
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
        const { setSettings: setDeviceSettings } = useDeviceSettings();
        const { deviceScreen } = useDeviceScreen();
        setDeviceSettings({
          theme_color:
            isFullScreen || deviceScreen === "home-screen"
              ? "transparent"
              : theme_color || "white",
        });
        const icon_blob_result = await fetchIconBlob(icons, iframeOrigin);
        if (icon_blob_result.isOk())
          storeAppHomeScreenData(
            short_name,
            icon_blob_result.value,
            iframeOrigin,
          );
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [safeAreaInset, setSafeAreaInset] = useState<string>(px(0));
  const { deviceScreen, setDeviceScreen } = useDeviceScreen();
  const { setSettings: setDeviceSettings, settings: deviceSettings } =
    useDeviceSettings();
  const { setDeviceFrameHeightClass } = useDeviceFrameHeight();
  const { isFullscreen, setIsFullscreen } = useFullscreen();
  const {
    storage: { lastUsedDevice: device },
  } = useLocalStorage();
  // setup data dir if it is not created;
  useEffect(() => {
    handleDirCreation();
  }, []);
  // set up effect for setting iframeSrc
  useEffect(() => {
    const src = iframeSrc;
    if (!src) return;
    localStorage.setItem("iframeSrc", src);
    setupPWAConfig(src, setSafeAreaInset);
    // send safeAreaInset for clients.
    iife(async () => {
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
    });
  }, [iframeSrc]);
  // set up homescreen theme_color effect
  useEffect(() => {
    if (deviceScreen === "home-screen") {
      setIframeSrc("");
      iife(async () => {
        await sleep(400);
        setDeviceSettings({
          ...deviceSettings,
          theme_color: "white",
        });
      });
    }
  }, [deviceScreen]);
  useEffect(() => {
    // set device screen to home
    setDeviceScreen("home-screen");
  }, [device]);
  const DeviceComponent = useCallback(DEVICE_MAPPING[device].component, [
    device,
  ]);

  return (
    <IframeSrcContext.Provider
      value={{
        src: iframeSrc,
        setSrc: setIframeSrc,
      }}
    >
      <IframeRefContext.Provider
        value={{
          ref: iframeRef,
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
            <TopNavbar />
            <div className="tws-flex-grow">
              <DeviceComponent />;
            </div>
            <Button
              onTap={() => {
                setIsFullscreen(false);
                // go back to normal height
                setDeviceFrameHeightClass(" tws-max-h-[93.6vh] ");
              }}
              className={cn(
                `tws-p-2 tws-border-[#44433E] tws-bg-[#474844] tws-rounded-full tws-absolute tws-bottom-1 tws-right-2 tws-z-[1000000000] `,
                {
                  "tws-hidden": !isFullscreen,
                },
              )}
            >
              <MinimizeFullscreen width={12} height={12} fill="white" />
            </Button>
          </section>
        </section>
      </IframeRefContext.Provider>
    </IframeSrcContext.Provider>
  );
};

const View = () => {
  return <Application />;
};

export default View;
