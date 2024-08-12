import Sidebar from "@/components/sidebar";
import { px } from "@/lib/utils";
import { removeNode } from "nixix";
import { reaction, signal } from "nixix/primitives";
import { Container, VStack } from "nixix/view-components";
import { DEVICE_MAPPING } from "./device-mapping";
import { $setBasePhoneConfig } from "./stores/base-phone-config";
import { $device } from "./stores/device";
import { $setDeviceSettings } from "./stores/device-settings";
import { $setIphoneConfig } from "./stores/iphone-config";

export function setupPWAConfig(src: string) {
  const { origin: iframeOrigin } = new URL(src);
    fetch(`${iframeOrigin}/manifest.json`)
      .then(async val => {
        // webmanifest data
        const manifest: App.WebManifest = val.ok ? (await val.json()) : {}
        if (manifest) {
          const isFullScreen = manifest.display === "fullscreen"
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
            theme_color: isFullScreen ? 'transparent' : (manifest.theme_color || 'white')
          })
        }
      })
      .catch(err => console.error(err))
}

/**
 * Every device has the device frame, the container with the `<iframe>` and the status bar inside, then lastly comes the virtual home button if it should have one.
 */
const View: Nixix.FC = (): someView => {
  const [iframeSrc] = signal<string>(
    localStorage.getItem("iframeSrc") || "http://localhost:3000",
  );

  // effect(() => {
  //   // subscribed
  //   const src = iframeSrc.value;
  //   localStorage.setItem("iframeSrc", src);
  //   setupPWAConfig(src)
  // });

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
              // setupPWAConfig(iframeSrc.value)
            }, [$device]);
          }}
        ></Container>
      </VStack>
      <Sidebar iframeSrc={iframeSrc} />
    </VStack>
  );
};

export default View;
