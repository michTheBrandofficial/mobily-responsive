import Sidebar from "@/components/sidebar";
import { prefixWithSlash, px } from "@/lib/utils";
import { removeNode } from "nixix";
import { effect, reaction, signal } from "nixix/primitives";
import { Container, VStack } from "nixix/view-components";
import { DEVICE_MAPPING } from "./device-mapping";
import { $setBasePhoneConfig } from "./stores/base-phone-config";
import { $device } from "./stores/device";
import { $setDeviceSettings } from "./stores/device-settings";
import { $setIphoneConfig } from "./stores/iphone-config";

const fetchIcon = async (icons: App.WebManifest['icons'], iframeOrigin: string) => {
  const icon192Or512 = icons.find(value => {
    return ['192x192', '512x512', '180x180'].includes(value.sizes)
  })?.src
  return new Promise<string>((resolve, reject) => {
    if (icon192Or512)
      fetch(`${iframeOrigin}${prefixWithSlash(icon192Or512)}`).then(async (val) => {
        if (val.ok) {
          const blob = await val.blob()
          const url = URL.createObjectURL(blob);
          resolve(url)
        }
      })
    else reject(`No app icon found for ${iframeOrigin}`)
  })
}

function setupPWAConfig(src: string) {
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
          theme_color: isFullScreen ? 'transparent' : (theme_color || 'white')
        })
        fetchIcon(icons, iframeOrigin).then(url => {
          console.log(url)
        }).catch(err => console.warn(err))
      }
    })
    .catch(err => console.error(err))
}

/**
 * @todo theme_color showing even on home screen bug
 * @todo get rust backend to steal most dominant color and send back to js.
 */
const View: Nixix.FC = (): someView => {
  const [iframeSrc] = signal<string>(
    localStorage.getItem("iframeSrc") || "http://localhost:3000",
  );

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
