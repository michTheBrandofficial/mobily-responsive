import Sidebar from "@/components/sidebar";
import { handleDirCreation } from "@/lib/file-handle";
import { blobToBinary, prefixWithSlash, px } from "@/lib/utils";
import { BaseDirectory, exists, readTextFile, writeBinaryFile, writeFile } from "@tauri-apps/api/fs";
import { removeNode } from "nixix";
import { effect, reaction, signal } from "nixix/primitives";
import { Container, VStack } from "nixix/view-components";
import { dataDir, FSOptions } from "./constants";
import { DEVICE_MAPPING } from "./device-mapping";
import { $setBasePhoneConfig } from "./stores/base-phone-config";
import { $device } from "./stores/device";
import { deviceScreen } from "./stores/device-screen";
import { $setDeviceSettings } from "./stores/device-settings";
import { $setIphoneConfig } from "./stores/iphone-config";

const fetchIconBlob = async (icons: App.WebManifest['icons'], iframeOrigin: string) => {
  return new Promise<Blob>((resolve, reject) => {
    const icon192or512 = icons.find(value => {
      return ['192x192', '512x512', '180x180'].includes(value.sizes)
    })?.src
    if (icon192or512)
      fetch(`${iframeOrigin}${prefixWithSlash(icon192or512)}`).then(async (val) => {
        if (val.ok) {
          resolve(await val.blob())
        }
      })
    else reject(`No app icon found for ${iframeOrigin}`)
  })
}

const storeAppHomeScreenData = async (name: string, blob: Blob, origin: string) => {
  // unique name using the short_name from the webmanifest combined with a base64 string formed from the origin
  const iconFileName = `${name.replace(' ', '')}-${btoa(origin).replace('=', '')}`
  const iconFilePath = `${dataDir}/AppIcons/${iconFileName}.png` as const;
  const binary = await blobToBinary(blob);
  await writeBinaryFile(
    {
      contents: binary,
      path: iconFilePath,
    }, FSOptions
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
      }
      await writeFile(
        {
          contents: JSON.stringify(fileAsJsonObject),
          path: `${dataDir}/icons.json`,
        }, FSOptions
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
          }
        }),
        path: `${dataDir}/icons.json`,
      },
      {
        dir: BaseDirectory.AppLocalData,
      },
    );
  }
}

const setupPWAConfig = (src: string) => {
  const { origin: iframeOrigin } = new URL(src);
  fetch(`${iframeOrigin}/manifest.json`)
    .then(async val => {
      // webmanifest data
      const manifest: App.WebManifest = val.ok ? (await val.json()) : {}
      if (manifest) {
        const { display, theme_color, short_name, icons } = manifest
        const isFullScreen = display === "fullscreen"
        if (isFullScreen) {
          $setBasePhoneConfig(prev => {
            prev.safeAreaInset = '0';
            return prev;
          })
          $setIphoneConfig(prev => {
            prev.safeAreaInset = '0';
            return prev;
          })
        }
        $setDeviceSettings({
          theme_color: (isFullScreen || deviceScreen.value === 'home-screen') ? 'transparent' : (theme_color || 'white') 
        })
        const icon_blob = await fetchIconBlob(icons, iframeOrigin)
          .then(blob => blob)
          .catch(err => console.warn(err));
        if (icon_blob)
          storeAppHomeScreenData(short_name, icon_blob, iframeOrigin)
      }
    })
    .catch(err => console.warn(err))
}

/**
 * @todo add field to the icons.json file in AppIcons
 */
const View: Nixix.FC = (): someView => {
  const [iframeSrc] = signal<string>(
    localStorage.getItem("iframeSrc") || "http://localhost:3000",
  );

  // setup data dir if it is not created;
  effect(handleDirCreation)

  effect(() => {
    // subscribed
    const src = iframeSrc.value;
    localStorage.setItem("iframeSrc", src);
    setupPWAConfig(src);
  });

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
        paddingInline: px(20),
        position: "relative",
      }}
    >
      <VStack className="tws-h-full tws-w-full tws-pl-3 tws-flex tws-items-center min-[600px]:tws-pl-0 min-[600px]:tws-justify-center ">
        <Container
          bind:ref={({ current }) => {
            function refetchFrame() {
              const Device = DEVICE_MAPPING[$device.value].component;
              const childNodes = current.childNodes;
              current.replaceChildren(<Device iframeSrc={iframeSrc} />);
              removeNode(childNodes as any);
            }
            refetchFrame();
            reaction(() => {
              refetchFrame();
              setupPWAConfig(iframeSrc.value)
            }, [$device]);
          }}
        ></Container>
      </VStack>
      <Sidebar iframeSrc={iframeSrc} />
    </VStack>
  );
};

export default View;
