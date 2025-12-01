import { cn } from "@/lib/cn";
import { useModalsBuilder } from "@/lib/modals-builder";
import { uint8 } from "@/lib/number";
import { pipe } from "@/lib/pipe";
import {
    inlineSwitch,
    noop,
    pick,
    removeLeadingSlash,
    separateProtocol,
    sleep,
} from "@/lib/utils";
import { useDeviceFrameHeight } from "@/src/constants";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useFullscreen } from "@/src/stores/fullscreen";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useLocalStorage } from "@/src/stores/local-storage";
import { useScreenState } from "@/src/stores/screen-state";
import { appWindow as simulatorAppWindow } from "@tauri-apps/api/window";
import { FormikProps, useFormik } from "formik";
import { Check, Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import AppSettingsMenu from "./app-menu";
import DeviceSelectMenu from "./device-select-menu";
import DeviceFrameIcon from "./icons/device-frame";
import Home from "./icons/home";
import { SearchIcon } from "./icons/search";
import Settings from "./icons/settings";
import { Button } from "./ui/buttons";
import { Input } from "./ui/inputs/input";
import SearchableSelect from "./ui/inputs/searchable-select";
import LiquidGlass from "./ui/liquid-glass";
import Modal, { BaseModalProps } from "./ui/modal";
import { Typography } from "./ui/typography";

const AnimatedCheckIcon = motion.create(Check);

interface UrlFormikType {
  url: string;
  protocol: string;
}

const urlValidationSchema = object({
  protocol: string()
    .required("Protocol is required")
    .oneOf(["http://", "https://"]),
  url: string().required("Url is required"),
});

const TopNavbar: React.FC = () => {
  const { setSrc: setIframeSrc, src: iframeSrc } = useIframeSrc();
  const { storage: { lastUsedDevice: device } } = useLocalStorage()
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isFullscreen, setIsFullscreen } = useFullscreen();
  const { setScreenState } = useScreenState();
  const { setDeviceFrameHeightClass } = useDeviceFrameHeight();
  const { setDeviceScreen, deviceScreen } = useDeviceScreen();
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
  const formik = useFormik<UrlFormikType>({
    initialValues: protocolResult.isOk()
      ? protocolResult.value
      : {
          protocol: "http://",
          url: "",
        },
    validationSchema: urlValidationSchema,
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
      <div className="tws-p-2 tws-px-3 tws-flex tws-items-center tws-gap-x-2.5 tws-rounded-full">
        <Button
          whileHover={{
            background: "#460804",
          }}
          onTap={() => simulatorAppWindow.close()}
          className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#460804] !tws-p-0 tws-rounded-full !tws-bg-[#ef6562] tws-group "
        >
          <XIcon className="tws-size-3 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
        </Button>
        <Button
          whileHover={{
            background: "#90591d",
          }}
          onTap={() => simulatorAppWindow.minimize()}
          className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#90591d] !tws-p-0 tws-rounded-full !tws-bg-[#eec14a] tws-group "
        >
          <MinusIcon className="tws-size-3 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
        </Button>
        <Button
          whileHover={{
            background: "#90591d",
          }}
          onTap={() => {
            setIsFullscreen(true);
            setDeviceFrameHeightClass(" tws-max-h-[100vh] ");
          }}
          className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#2a6218] !tws-p-0 tws-rounded-full !tws-bg-[#57c957] tws-group "
        >
          <Maximize2Icon className="tws-size-2 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
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
        className="tws-p-2 tws-px-3 tws-flex tws-ml-auto tws-items-center tws-space-x-4 tws-rounded-full tws-transition-colors tws-duration-200 tws-ease-linear "
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
          layout
          initial={false}
          animate={
            deviceScreen === "home-screen"
              ? {
                  opacity: 0,
                  width: 0,
                }
              : {
                  opacity: 1,
                  width: "auto",
                }
          }
          className={cn("!tws-p-0 tws-bg-transparent ", {
            "!tws-ml-0": deviceScreen === "home-screen",
          })}
        >
          <SearchIcon className={"tws-size-5 tws-h-[18px] tws-fill-white"} />
        </Button>
        {/* device select popover here */}
        <DeviceSelectMenu
          trigger={<DeviceFrameIcon className={"tws-size-5 tws-text-white "} />}
        />
        <AppSettingsMenu
          trigger={<Settings className={"tws-size-5 tws-fill-white"} />}
        />
      </LiquidGlass.div>
      <UrlModal
        open={modals.url.open}
        onClose={modalFunctions.returnClose("url")}
        formik={formik}
        inputRef={inputRef}
        onSave={async () => {
          setIframeSrc(
            `${formik.values.protocol}${removeLeadingSlash(formik.values.url)}`,
          );
          await sleep(400);
          modalFunctions.closeModal("url");
        }}
      />
    </section>
  );
};

interface UrlModalProps extends BaseModalProps {
  formik: FormikProps<UrlFormikType>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSave(): void;
}

const UrlModal: React.FC<UrlModalProps> = (props) => {
  const { formik, open, onClose, onSave, inputRef } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Body className="tws-max-w-80 ">
        <LiquidGlass.div
          className="tws-p-5 tws-pt-6 tws-w-fit tws-rounded-[48px]  "
          color={"#fff"}
          mixingPercentage={80}
        >
          <div className="tws-flex tws-flex-col tws-gap-y-1.5 tws-px-1 ">
            <Typography.h5 className="tws-text-lg tws-font-Switzer tws-text-zinc-900">
              Add URL
            </Typography.h5>
            <Typography.p className="tws-text-base tws-leading-[26px] tws-w-full tws-font-Switzer tws-text-wrap tws-font-normal tws-text-zinc-900">
              Enter your site's URL to preview it on this device.
            </Typography.p>
          </div>
          <div className="tws-w-[280px] tws-h-fit tws-py-4 tws-px-6 tws-mt-6 tws-bg-zinc-300 tws-rounded-[32px] ">
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
                  className="tws-pr-2"
                >
                  <div className="tws-flex tws-items-start tws-gap-x-2">
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
                      className="tws-mt-1 "
                    />
                    <div className="tws-flex tws-flex-col t">
                      <span className="tws-text-sm tws-font-medium">
                        {option.label}
                      </span>
                      <span className="tws-text-xs tws-font-normal tws-text-zinc-600 "></span>
                    </div>
                    <span className="tws-text-xs tws-ml-auto tws-inline-block tws-px-2 tws-py-1 tws-rounded-full tws-bg-sky-50/50 tws-text-sky-500 tws-font-medium ">
                      {option.value}
                    </span>
                  </div>
                </SearchableSelect.Option>
              )}
            </SearchableSelect>
            <Input.TextArea
              inputRef={inputRef}
              value={formik.values.url}
              rows={2}
              required
              onChange={(e) => {
                formik.setFieldValue("url", e.target.value);
              }}
              className="tws-caret-zinc-950 "
              name="url"
              placeholder="Url e.g acme.com"
            />
          </div>
          <div className="tws-mt-6 tws-flex tws-items-center tws-gap-x-3 ">
            <Button
              onTap={onClose}
              className="!tws-rounded-full !/tws-bg-[#bfb9c9] !tws-bg-zinc-300 tws-w-full tws-py-3.5"
              variant="dormant"
            >
              Cancel
            </Button>
            <Button
              onTap={onSave}
              disabled={!formik.isValid}
              className="!tws-rounded-full tws-w-full tws-py-3.5"
            >
              Ok
            </Button>
          </div>
        </LiquidGlass.div>
      </Modal.Body>
    </Modal>
  );
};

export default TopNavbar;
