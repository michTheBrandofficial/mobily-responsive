import { percentage, px } from "@/lib/utils";
import { homeScreenIconScale } from "@/src/constants";
import { useBasePhoneConfig } from "@/src/stores/base-phone-config";
import { useIconCoordinates } from "@/src/stores/icon-coordinates";
import { IphoneConfig, useIphoneConfig } from "@/src/stores/iphone-config";
import VirtualHomeButton from "~/components/virtual-home-button";
import { useDeviceScreen } from "~/stores/device-screen";
import Iframe from "./iframe";
import { useScreenState } from "@/src/stores/screen-state";
import { useDeviceSettings } from "@/src/stores/device-settings";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useEffect, useRef } from "react";
import { useIframeRef } from "@/src/stores/iframe-ref";

// default canfig is iphone
const AppScreen = ({ config = "iphone" }: { config: "base" | "iphone" }) => {
  const { src: iframeSrc } = useIframeSrc();
  const { ref: iframeRef } = useIframeRef();
  const appScreenRef = useRef<HTMLDivElement>(null);
  const { deviceScreen } = useDeviceScreen();
  const { settings: deviceSettings } = useDeviceSettings();
  const { setScreenState } = useScreenState();
  const newIconSize = homeScreenIconScale * 64;
  // leave this animation here for reversal;
  let animation = useRef<Animation | null>(null);
  useEffect(() => {
    const isAppScreenOpen = deviceScreen === "app-screen";
    const appScreenEl = appScreenRef.current;
    const [xCoordinate, yCoordinate, isInFirstTwoIcons] =
      useIconCoordinates.getState().iconCoordinates;
    if (appScreenEl) {
      const animationOptions: KeyframeAnimationOptions = {
        duration: 1000,
        fill: "forwards",
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
      };
      let animationKeyFrames: Keyframe[];
      if (isAppScreenOpen) {
        // set the scale now, so we get an accurate bounding client
        // gotten from device height times 96 (being the scale for)
        Object.assign(appScreenEl.style, {
          scale: `${64 / 391.421875} ${64 / 846.5}`,
        });
        const { x, y } = appScreenEl.getBoundingClientRect();
        animationKeyFrames = [
          {
            offset: 0,
            opacity: 0.3,
            translate: `${px(xCoordinate - x)} ${px(yCoordinate - y)}`,
          },
          {
            offset: 0.5,
            opacity: 0.9,
            scale: `${newIconSize / 391.421875} ${newIconSize / 846.5}`,
            translate: `${px(
              xCoordinate - x + (isInFirstTwoIcons ? 30 : -30),
            )} ${px(yCoordinate - y + 30)}`,
          },
          {
            offset: 0.75,
            opacity: 0.95,
            scale: ".9",
            translate: `0 0`,
          },
          {
            opacity: 1,
            // if left at 1.00 home screen shows a little, which is bad
            scale: "1",
            translate: `0px`,
          },
        ];
        animation.current = appScreenEl.animate(animationKeyFrames, animationOptions);
        animation.current.addEventListener("finish", function finish() {
          setScreenState("after-app-launch");
          animation.current?.removeEventListener("finish", finish);
        });
      } else animation.current?.reverse();
    }
  }, [deviceScreen]);
  let phoneConfig: IphoneConfig =
    config === "base"
      ? useBasePhoneConfig().basePhoneConfig
      : useIphoneConfig().iphoneConfig;
  return (
    <div
      ref={appScreenRef}
      className=" "
      style={{
        width: percentage(100),
        height: percentage(100),
        clipPath: phoneConfig.clothoidRadius,
        position: "absolute",
        zIndex: 800,
        backgroundColor: "transparent",
        top: px(0),
        left: px(0),
        opacity: 0,
        scale: 0,
        paddingTop: phoneConfig.safeAreaInset,
      }}
    >
      <div
        style={{
          width: percentage(100),
          height: phoneConfig.safeAreaInset,
          backgroundColor: deviceSettings.theme_color,
          position: "absolute",
          top: px(0),
        }}
      />
      <div
        className="tws-peer "
        style={{
          height: percentage(100),
          width: percentage(100),
          backgroundColor: "white",
        }}
      >
        <Iframe src={iframeSrc} ref={iframeRef} />
      </div>
      <div
        className={`tws-flex tws-items-center tws-justify-center tws-transition-transform tws-duration-500 `}
        style={{
          width: percentage(100),
          height: "fit-content",
          position: "absolute",
          bottom: phoneConfig.deviceBarRatios.bottom,
          zIndex: 900,
        }}
      >
        <VirtualHomeButton
          className="tws-rounded-full"
          style={{
            width: phoneConfig.virtualHomeButtonWidth,
            backgroundColor: "#080808",
          }}
        />
      </div>
    </div>
  );
};

export default AppScreen;
