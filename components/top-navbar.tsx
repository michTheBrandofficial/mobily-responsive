import { cn } from "@/lib/cn";
import { pipe } from "@/lib/pipe";
import { inlineSwitch, noop, pick, sleep } from "@/lib/utils";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDevice } from "@/src/stores/device";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useFullscreen } from "@/src/stores/fullscreen";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useScreenState } from "@/src/stores/screen-state";
import React, { useEffect, useRef, useState } from "react";
import AppMenu from "./app-menu";
import DeviceSelectMenu from "./device-select-menu";
import Home from "./icons/home";
import Reload from "./icons/reload";
import { SearchIcon } from "./icons/search";
import { Button } from "./ui/buttons";

const TopNavbar: React.FC = () => {
  const { setSrc, src: iframeSrc } = useIframeSrc();
  const { device } = useDevice();
  console.log(device)
  const deviceDisplayName = pick(
    DEVICE_MAPPING[device] ?? {},
    "displayName",
    "version",
  );
  const versionMemo = pipe(DEVICE_MAPPING[device] ?? {}, ({ type, version }) => {
    return inlineSwitch(type, ["ipad", `iPadOS ${version}`], {
      default: `iOS ${version}`,
    });
  });
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false);
  const { isFullscreen } = useFullscreen();
  const { setScreenState } = useScreenState();
  const { setDeviceScreen, deviceScreen } = useDeviceScreen();
  const classMemo = isFullscreen ? "tws-hidden" : "tws-flex";
  useEffect(() => {
    const focus = async () => {
      if (isInputOpen) {
        await sleep(500);
        inputRef.current?.focus();
      }
    };
    focus();
  }, [isInputOpen]);

  return (
    <section
      className={cn(
        "tws-w-screen tws-max-w-[386px] tws-max-h-[45px] tws-border tws-border-[#44433E] tws-rounded-xl tws-items-center tws-justify-between tws-gap-5 tws-mt-1 tws-py-2 tws-px-6 tws-bg-[#474844] tws-relative tws-overflow-x-clip",
        classMemo,
      )}
    >
      <div
        data-inputopen={isInputOpen}
        className="tws-flex tws-flex-col tws-justify-center tws-text-xs -tws-space-y-0.5 data-[inputopen=true]:-tws-translate-x-[200%] tws-transition-[transform] tws-duration-300 tws-ease-linear "
      >
        <p className="tws-text-[#ECEDE9] tws-font-bold ">
          {deviceDisplayName.displayName}
        </p>
        <p className="tws-text-[#B0B0AD] tws-font-medium ">{versionMemo}</p>
      </div>
      <form
        ref={formRef}
        data-open={isInputOpen}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          setSrc(formData.get("url") as string);
          setIsInputOpen(false);
        }}
        className="tws-min-w-full tws-h-full tws-transition-[transform] tws-duration-300 tws-ease-linear tws-delay-200 tws-origin-center tws-scale-x-0 data-[open=true]:tws-scale-x-100 tws-absolute tws-top-[92%] tws-left-1/2 -tws-translate-x-1/2 "
      >
        <div className="tws-relative">
          <input
            type="text"
            ref={inputRef}
            value={iframeSrc}
            name="url"
            onBlur={() => {
              formRef.current?.requestSubmit();
              setIsInputOpen(false);
            }}
            className="tws-w-[90%] tws-absolute tws-left-1/2 -tws-translate-x-1/2 tws-bottom-1.5 focus:tws-outline-none tws-bg-transparent tws-border-b-2 tws-border-[#CFCFCC] tws-pb-1 tws-caret-white tws-text-white tws-text-sm tws-text-center tws-font-medium "
          />
          <Button
            type="submit"
            className="tws-absolute tws-right-6 tws-bottom-3 tws-z-30"
            onTap={noop}
          >
            <SearchIcon
              className={"tws-w-[18px] tws-h-[18px] tws-fill-[#CFCFCC]"}
            />
          </Button>
        </div>
      </form>
      <div
        data-inputopen={isInputOpen}
        className="tws-flex tws-ml-auto tws-gap-x-5 data-[inputopen=true]:tws-translate-x-[200%] tws-transition-[transform] tws-duration-300 tws-ease-linear"
      >
        <Button
          onTap={() => {
            setScreenState("before-close-app");
            setDeviceScreen("home-screen");
          }}
        >
          <Home className={"tws-w-5 tws-h-5 tws-fill-[#CFCFCC]"} />
        </Button>
        <Button
          onTap={() => {
            const url = iframeSrc;
            setSrc("");
            setSrc(url);
          }}
        >
          <Reload className={"tws-w-5 tws-fill-[#CFCFCC]"} />
        </Button>
        <Button
          onTap={() => {
            if (deviceScreen === "app-screen") setIsInputOpen(true);
          }}
        >
          <SearchIcon className={"tws-w-5 tws-h-[18px] tws-fill-[#CFCFCC]"} />
        </Button>
        <DeviceSelectMenu />
        <AppMenu />
      </div>
    </section>
  );
};

export default TopNavbar;
