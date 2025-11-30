import { cn } from "@/lib/cn";
import { useModalsBuilder } from "@/lib/modals-builder";
import { uint8 } from "@/lib/number";
import { pipe } from "@/lib/pipe";
import { inlineSwitch, noop, pick, separateProtocol, sleep } from "@/lib/utils";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDevice } from "@/src/stores/device";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useFullscreen } from "@/src/stores/fullscreen";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useScreenState } from "@/src/stores/screen-state";
import { appWindow as simulatorAppWindow } from "@tauri-apps/api/window";
import { useFormik } from "formik";
import { Check, Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import AppMenu from "./app-menu";
import DeviceSelectMenu from "./device-select-menu";
import Home from "./icons/home";
import Reload from "./icons/reload";
import { SearchIcon } from "./icons/search";
import Settings from "./icons/settings";
import { Button } from "./ui/buttons";
import { Input } from "./ui/inputs/input";
import SearchableSelect from "./ui/inputs/searchable-select";
import LiquidGlass from "./ui/liquid-glass";
import Modal from "./ui/modal";

const AnimatedCheckIcon = motion.create(Check);

const TopNavbar: React.FC = () => {
  const { setSrc: setIframeSrc, src: iframeSrc } = useIframeSrc();
  const { device } = useDevice();
  const deviceDisplayName = pick(
    DEVICE_MAPPING[device],
    "displayName",
    "version",
  );
  const versionMemo = pipe(DEVICE_MAPPING[device], ({ type, version }) => {
    return inlineSwitch(
      type,
      /*["ipad", `iPadOS ${version}`]*/ {
        default: `iOS ${version}`,
      },
    );
  });
  const { modals, modalFunctions } = useModalsBuilder({
    url: {
      open: false,
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { isFullscreen, setIsFullscreen } = useFullscreen();
  const { setScreenState } = useScreenState();
  const { setDeviceScreen } = useDeviceScreen();
  const classMemo = isFullscreen ? "tws-hidden" : "tws-flex";
  const [mixingPercentage, setMixingPercentage] = useState(12);
  useEffect(() => {
    function onBlur() {
      setMixingPercentage(0);
    }
    function onFocus() {
      setMixingPercentage(12);
    }
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  const protocolResult = separateProtocol(iframeSrc);
  useEffect(() => {
    if (protocolResult.isErr()) return; // we should show the in the top navbar.
  }, [protocolResult]);
  const formik = useFormik({
    initialValues: protocolResult.isOk()
      ? protocolResult.value
      : {
          protocol: "http://",
          url: "",
        },
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: noop,
  });

  return (
    <section
      className={cn(
        "tws-w-screen tws-max-w-[384px] tws-border tws-border-gray-100/40 tws-rounded-full tws-items-center tws-justify-between tws-gap-3 tws-mt-1 tws-p-2 tws-bg-[#474844] tws-relative ",
        classMemo,
      )}
    >
      <div className="tws-p-2 tws-px-3 tws-flex tws-items-center tws-gap-x-3 tws-rounded-full">
        <Button
          whileHover={{
            background: "#460804",
          }}
          onTap={() => simulatorAppWindow.close()}
          className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#460804] !tws-p-0 tws-rounded-full !tws-bg-[#ef6562] "
        >
          <XIcon className="tws-size-3 " />
        </Button>
        <Button
          whileHover={{
            background: "#90591d",
          }}
          onTap={() => simulatorAppWindow.minimize()}
          className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#90591d] !tws-p-0 tws-rounded-full !tws-bg-[#eec14a] "
        >
          <MinusIcon className="tws-size-3 " />
        </Button>
        <Button
          whileHover={{
            background: "#90591d",
          }}
          onTap={() => setIsFullscreen(true)}
          className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#2a6218] !tws-p-0 tws-rounded-full !tws-bg-[#57c957] "
        >
          <Maximize2Icon className="tws-size-2 " />
        </Button>
      </div>
      <div className="tws-flex tws-flex-col tws-justify-center tws-text-xs -tws-space-y-0.5 ">
        <p className="tws-text-[#ECEDE9] tws-font-bold ">
          {deviceDisplayName.displayName}
        </p>
        <p className="tws-text-[#B0B0AD] tws-font-medium ">
          {versionMemo as any}
        </p>
      </div>
      <LiquidGlass.div
        className="tws-p-2 tws-px-3 tws-flex tws-ml-auto tws-items-center tws-gap-x-4 tws-rounded-full tws-transition-colors tws-duration-200 tws-ease-linear "
        tint={[uint8(255), uint8(255), uint8(255)]}
        tintOpacity={0.3}
        mixingPercentage={mixingPercentage}
      >
        <Button
          onTap={() => {
            setScreenState("before-close-app");
            setDeviceScreen("home-screen");
          }}
          className="!tws-p-0 tws-bg-transparent "
        >
          <Home className={"tws-size-5 tws-fill-white"} />
        </Button>
        <Button
          onTap={async () => {
            modalFunctions.openModal("url", {});
            await sleep(500);
            inputRef.current?.focus();
          }}
          className="!tws-p-0 tws-bg-transparent "
        >
          <SearchIcon className={"tws-size-5 tws-h-[18px] tws-fill-white"} />
        </Button>
        <Settings className={"tws-size-5 tws-fill-white"} />
      </LiquidGlass.div>

      <div className="tws-hidden tws-ml-auto tws-gap-x-5 data-[inputopen=true]:tws-translate-x-[200%] tws-transition-[transform] tws-duration-300 tws-ease-linear">
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
            setIframeSrc("");
            setIframeSrc(url);
          }}
        >
          <Reload className={"tws-w-5 tws-fill-[#CFCFCC]"} />
        </Button>
        <DeviceSelectMenu />
        <AppMenu />
      </div>
      <Modal open={modals.url.open} onClose={modalFunctions.returnClose("url")}>
        <Modal.Body className="">
          <LiquidGlass.div
            className="tws-p-4 tws-pt-12 tws-w-fit tws-rounded-[48px]  "
            color={"#fff"}
            mixingPercentage={80}
          >
            <div className="tws-w-[280px] tws-h-fit tws-py-4 tws-px-6 tws-bg-[#bfb9c9] tws-rounded-[32px] ">
              <SearchableSelect
                bottomBorder
                required
                className="tws-w-full "
                placeholder="Protocol e.g HTTP"
                options={[
                  { label: "HTTP", value: "http://" },
                  { label: "HTTPS", value: "https://" },
                ]}
                onChange={(value) =>
                  formik.setFieldValue("protocol", value?.value || "")
                }
                value={formik.values.protocol}
              >
                {(option, index) => (
                  <SearchableSelect.Option
                    option={option}
                    index={index}
                    key={index}
                  >
                    <div className="tws-flex tws-items-center tws-gap-x-2">
                      <AnimatedCheckIcon
                        size={16}
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: {
                            pathLength: 1,
                            opacity: 1,
                            transition: {
                              pathLength: {
                                delay: 0.2,
                                type: "spring",
                                duration: 1.5,
                                bounce: 0,
                              },
                              opacity: { delay: 0.2, duration: 0.01 },
                            },
                          },
                        }}
                        initial={"hidden"}
                        animate={option.isSelected ? "visible" : "hidden"}
                      />
                      <span className="tws-text-sm tws-font-medium">
                        {option.label}
                      </span>
                    </div>
                  </SearchableSelect.Option>
                )}
              </SearchableSelect>
              <Input.TextArea
                value={formik.values.url}
                required
                onChange={(e) => {
                  formik.setFieldValue("url", e.target.value);
                }}
                className=" "
                name="url"
                placeholder="Url e.g acme.com"
              />
            </div>
            <div className="tws-mt-4 tws-flex tws-items-center tws-gap-x-3 ">
              <Button
                className="!tws-rounded-full !tws-bg-[#bfb9c9] tws-w-full tws-py-3"
                variant="dormant"
              >
                Cancel
              </Button>
              <Button className="!tws-rounded-full tws-w-full tws-py-3">
                Ok
              </Button>
            </div>
          </LiquidGlass.div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default TopNavbar;
