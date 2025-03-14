import { ErrorMatcher } from "@/lib/error-matcher";
import { handleDirCreation } from "@/lib/file-handle";
import { blobToBinary, prefixWithSlash, px, wait } from "@/lib/utils";
import {
  BaseDirectory,
  exists,
  readTextFile,
  writeBinaryFile,
  writeFile,
} from "@tauri-apps/api/fs";
import { effect, reaction, signal } from "nixix/primitives";
import { Container, VStack } from "nixix/view-components";
import { dataDir, FSOptions, iframeRef } from "./constants";
import { DEVICE_MAPPING } from "./device-mapping";
import { useBasePhoneConfig } from "./stores/base-phone-config";
import { useDevice } from "./stores/device";
import { useDeviceScreen } from "./stores/device-screen";
import { useDeviceSettings } from "./stores/device-settings";
import { useIphoneConfig } from "./stores/iphone-config";
import TopNavbar from "@/components/top-navbar";
import Loaders from "@/components/loaders";

const [safeAreaInset, setSafeAreaInset] = signal<string>(px(0));

const fetchIconBlob = async (
  icons: App.WebManifest["icons"],
  iframeOrigin: string
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
        }
      );
    else reject(`No app icon found for ${iframeOrigin}`);
  });
};

const storeAppHomeScreenData = async (
  name: string,
  blob: Blob,
  origin: string
) => {
  // unique name using the short_name from the webmanifest combined with a base64 string formed from the origin
  const iconFileName = `${name.replace(" ", "")}-${btoa(origin).replace(
    /=/g,
    ""
  )}`;
  const iconFilePath = `${dataDir}/AppIcons/${iconFileName}.png` as const;
  const binary = await blobToBinary(blob);
  await writeBinaryFile(
    {
      contents: binary,
      path: iconFilePath,
    },
    FSOptions
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
        FSOptions
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
      }
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

const View: Nixix.FC = (): someView => {
  const [iframeSrc] = signal<string>("");
  const { deviceScreen } = useDeviceScreen();
  // setup data dir if it is not created;
  effect(handleDirCreation);
  effect(() => {
    // subscribed
    const src = iframeSrc.value;
    if (!src) return;
    localStorage.setItem("iframeSrc", src);
    setupPWAConfig(src);
  });
  reaction(() => {
    if (deviceScreen.value === "home-screen") {
      iframeSrc.value = "";
      wait(
        () =>
          useDeviceSettings().setDeviceSettings((p) => {
            p.theme_color = "white";
            return p;
          }),
        400
      );
    }
  }, [deviceScreen]);
  reaction(() => {
    setTimeout(() => {
      const message = {
        type: "mobily-responsive-safeAreaInset",
        safeAreaInsetTop: safeAreaInset.value,
      };
      if (deviceScreen.value === "app-screen")
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify(message),
          new URL(iframeSrc.value).origin
        );
    }, 1000);
  }, [iframeSrc]);

  return (
    <VStack
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
      <VStack className="tws-h-screen tws-w-fit tws-pl-0 tws-flex tws-gap-y-1 tws-pb-1 tws-pt-1 tws-flex-col tws-items-center tws-justify-between ">
        <TopNavbar iframeSrc={iframeSrc} />
        <Container
          className="tws-flex-grow"
          bind:ref={({ current }) => {
            const { device } = useDevice();
            function refetchFrame() {
              const Device = DEVICE_MAPPING[device.value].component;
              current.replaceChildren(<Device iframeSrc={iframeSrc} />);
              useDeviceScreen().setDeviceScreen("home-screen");
            }
            refetchFrame();
            reaction(() => {
              refetchFrame();
              setupPWAConfig(iframeSrc.value);
            }, [device]);
          }}
        ></Container>
        <Loaders.IOSSpinner />
      </VStack>
    </VStack>
  );
};

export default View;
