import { cn } from "@/lib/cn";
import { percentage, px, sleep } from "@/lib/utils";
import HomeIndicator from "@/src/components/home-indicator";
import { homeScreenIconScale } from "@/src/constants";
import { useDeviceSettings } from "@/src/stores/device-settings";
import { useIconCoordinates } from "@/src/stores/icon-coordinates";
import { useIframeRef } from "@/src/stores/iframe-ref";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useScreenState } from "@/src/stores/screen-state";
import { useEffect, useRef } from "react";
import { useDeviceScreen } from "~/stores/device-screen";
import Iframe from "./iframe";
import { useLocalStorage } from "@/src/stores/local-storage";
import { useHotkeys } from "react-hotkeys-hook";
import { fileSpecificHotKeysConfig } from "@/src/hot-keys-config";

// default canfig is iphone
const AppScreen = ({}: { config?: "base" | "iphone"; topPadding?: string }) => {
  const { src: iframeSrc, setSrc: setIframeSrc } = useIframeSrc();
  const { ref: iframeRef } = useIframeRef();
  const appScreenRef = useRef<HTMLDivElement>(null);
  const { deviceScreen } = useDeviceScreen();
  const { settings: deviceSettings } = useDeviceSettings();
  const { setScreenState } = useScreenState();
  const newIconSize = homeScreenIconScale * 64;
  const {
    storage: { lastUsedDevice: device },
  } = useLocalStorage();
  const isIpad = device.toLowerCase().includes("ipad");
  // leave this animation here for reversal;
  let animation = useRef<Animation | null>(null);
  useEffect(() => {
    const isAppScreenOpen = deviceScreen === "app-screen";
    const appScreenEl = appScreenRef.current;
    const [xCoordinate, yCoordinate, isInFirstTwoIcons] =
      useIconCoordinates.getState().iconCoordinates;
    if (appScreenEl) {
      const animationOptions: KeyframeAnimationOptions = {
        duration: 300,
        fill: "forwards",
        easing: "ease-out",
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
              xCoordinate - x + (isInFirstTwoIcons ? 30 : -30)
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
        animation.current = appScreenEl.animate(
          animationKeyFrames,
          animationOptions
        );
        animation.current.addEventListener("finish", function finish() {
          setScreenState("after-app-launch");
          animation.current?.removeEventListener("finish", finish);
        });
      } else animation.current?.reverse();
    }
  }, [deviceScreen]);

  // register hot key for reload
  useHotkeys(fileSpecificHotKeysConfig.reloadUrl.raw, async () => {
    if (deviceScreen === "app-screen") {
      const oldSrc = iframeSrc;
      setIframeSrc("");
      await sleep(50);
      setIframeSrc(oldSrc);
    }
  });
  return (
    <div
      ref={appScreenRef}
      className={cn(
        "tws-size-full tws-absolute tws-z-[800] tws-bg-transparent tws-top-0 tws-left-0 tws-rounded-[var(--radius)] tws-flex tws-flex-col "
      )}
      style={{
        opacity: 0,
        scale: 0,
      }}
    >
      <div
        className={cn("tws-w-full tws-h-[var(--appscreen-padding-height)]")}
        style={{
          width: percentage(100),
          backgroundColor: deviceSettings.theme_color,
        }}
      />
      <div className="tws-peer tws-flex-grow tws-size-full tws-bg-white ">
        <Iframe src={iframeSrc} ref={iframeRef} />
      </div>
      <div
        // yes, this is the standard home indicator position in iOS and iPadOS
        className={cn(
          `tws-flex tws-items-center tws-justify-center tws-transition-transform tws-duration-500 `,
          "tws-w-full tws-h-fit tws-absolute tws-bottom-1 tws-z-[900]"
        )}
      >
        <HomeIndicator
          className={cn("", {
            "tws-w-[calc(var(--screen-container-width)*0.26)]": isIpad,
            "tws-w-[calc(var(--screen-container-width)*0.35)]": !isIpad,
          })}
          style={{
            backgroundColor: "#080808",
          }}
        />
      </div>
    </div>
  );
};

export default AppScreen;
