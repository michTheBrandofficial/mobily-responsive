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
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDevice } from "@/src/stores/device";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useFullscreen } from "@/src/stores/fullscreen";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useScreenState } from "@/src/stores/screen-state";
import { appWindow as simulatorAppWindow } from "@tauri-apps/api/window";
import { FormikProps, useFormik } from "formik";
import { Check, Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import AppMenu from "./app-menu";
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
import { object, string } from "yup";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
      <div className="tws-p-2 tws-px-3 tws-flex tws-items-center tws-gap-x-3 tws-rounded-full">
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
          onTap={() => setIsFullscreen(true)}
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
        {/* device select popover here */}
        <Button
          onTap={async () => {
            modalFunctions.openModal("url", {});
          }}
          className="!tws-p-0 tws-bg-transparent "
        >
          <DeviceFrameIcon className={"tws-size-5 "} />
        </Button>
        <Settings className={"tws-size-5 tws-fill-white"} />
      </LiquidGlass.div>

      <div className="tws-hidden tws-ml-auto tws-gap-x-5 data-[inputopen=true]:tws-translate-x-[200%] tws-transition-[transform] tws-duration-300 tws-ease-linear">
        <DeviceSelectMenu />
        <AppMenu />
      </div>
      <UrlModal
        open={modals.url.open}
        onClose={modalFunctions.returnClose("url")}
        formik={formik}
        inputRef={inputRef}
        onSave={() => {
          setIframeSrc(
            `${formik.values.protocol}${removeLeadingSlash(formik.values.url)}`,
          );
          modalFunctions.closeModal('url')
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
      <Modal.Body className="">
        <LiquidGlass.div
          className="tws-p-4 tws-pt-12 tws-w-fit tws-rounded-[48px]  "
          color={"#fff"}
          mixingPercentage={80}
        >
          <div className="tws-w-[280px] tws-h-fit tws-py-4 tws-px-6 tws-bg-zinc-300 tws-rounded-[32px] ">
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
              inputRef={inputRef}
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
              onTap={onClose}
              className="!tws-rounded-full !/tws-bg-[#bfb9c9] !tws-bg-zinc-300 tws-w-full tws-py-3"
              variant="dormant"
            >
              Cancel
            </Button>
            <Button
              onTap={onSave}
              disabled={!formik.isValid}
              className="!tws-rounded-full tws-w-full tws-py-3"
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
