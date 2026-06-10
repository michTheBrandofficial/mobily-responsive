import { cn } from "@/lib/cn";
import {
  iife,
  noop,
  removeLeadingSlash,
  separateProtocol,
  sleep,
} from "@/lib/utils";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { object, string } from "yup";
import { useCommandTriggeredModal } from "./command-triggered-hotkeys";
import { Button } from "./ui/buttons";
import { Input } from "./ui/inputs/input";
import Modal from "./ui/modal";
import { Typography } from "./ui/typography";

const CommandTriggeredModals = () => {
  return (
    <>
      <UrlInputModal />
    </>
  );
};

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

const UrlInputModal = () => {
  const { commandModal, setCommandModal } = useCommandTriggeredModal();
  const { src: iframeSrc, setSrc: setIframeSrc } = useIframeSrc();
  const onClose = () => setCommandModal("url-input", false);
  const protocolResult = separateProtocol(iframeSrc);
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { deviceScreen } = useDeviceScreen();
  useEffect(() => {
    if (!commandModal["url-input"].open) return;
    iife(async () => {
      await sleep(500);
      inputRef.current?.focus();
    });
  }, [commandModal["url-input"].open]);

  return (
    <Modal
      open={commandModal["url-input"].open && deviceScreen === "app-screen"}
      onClose={onClose}
    >
      <Modal.Body
        initial={{ scale: 0.5 }}
        animate={{
          scale: 1,
          transition: {
            duration: 0.12,
            ease: "easeOut",
          },
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 0.15,
            ease: "easeIn",
          },
        }}
        onKeyUp={(e) => {
          if (e.key === "Escape") onClose();
        }}
        className={cn(
          "tws-origin-top",
          "tws-min-h-[220px] !tws-w-full !tws-max-w-[252px] tws-bg-white/80 tws-p-4 tws-pt-3.5 tws-rounded-[32px] ",
          "tws-shadow-[1px_0px_1px_1px_rgba(231,229,228,0.6),_0px_0px_1px_1px_rgba(0,0,0,.25)] "
        )}
      >
        <div className="tws-flex tws-flex-col tws-px-1 ">
          <Typography.p className="tws-text-base tws-font-semibold tws-font-SF_Pro_Display tws-text-zinc-900 tws-mb-1 ">
            Add URL
          </Typography.p>
          <Typography.p className="tws-text-sm tws-leading-[20px] tws-w-full tws-font-Switzer tws-font-normal tws-text-zinc-900">
            Enter your site's URL to preview it on this device.
          </Typography.p>
        </div>
        <div className="tws-w-full tws-h-fit tws-py-2 tws-px-2.5 tws-mt-6 tws-bg-gray-300 tws-rounded-[28px] ">
          <div
            className={cn(
              "tws-w-fit tws-h-fit tws-bg-[#bbbbbd] tws-font-normal tws-rounded-md ",
              "tws-grid tws-grid-cols-2 tws-relative ",
              "after:tws-absolute after:tws-z-10 after:tws-h-full after:tws-w-1/2 after:tws-bg-white after:tws-rounded-md after:tws-transition-all after:tws-duration-[200] after:tws-ease-in-out",
              {
                "after:tws-translate-x-full":
                  formik.values.protocol === "https://",
              }
            )}
          >
            <button
              onClick={() => formik.setFieldValue("protocol", "http://")}
              className="tws-text-white tws-relative tws-z-20 tws-px-2.5 tws-py-1.5 tws-text-xs tws-mix-blend-difference"
            >
              HTTP
            </button>
            <button
              onClick={() => formik.setFieldValue("protocol", "https://")}
              className="tws-text-white tws-relative tws-z-20 tws-px-2.5 tws-py-1.5 tws-text-xs tws-mix-blend-difference"
            >
              HTTPS
            </button>
          </div>
          <Input.TextArea
            inputRef={inputRef}
            value={formik.values.url}
            rows={2}
            required
            onChange={(e) => {
              formik.setFieldValue("url", e.target.value);
            }}
            className="tws-caret-zinc-950  "
            name="url"
            placeholder="Url e.g acme.com"
          />
        </div>
        <div className="tws-mt-4 tws-flex tws-items-center tws-gap-x-2.5 ">
          <Button
            onTap={onClose}
            className="!tws-rounded-[24px] !/tws-bg-[#bfb9c9] !tws-bg-gray-300 tws-w-full !tws-py-1.5"
            variant="dormant"
          >
            Cancel
          </Button>
          <Button
            onTap={async () => {
              onClose();
              await sleep(300);
              setIframeSrc(
                `${formik.values.protocol}${removeLeadingSlash(formik.values.url)}`
              );
            }}
            disabled={!formik.isValid}
            className="!tws-rounded-[24px] tws-w-full !tws-py-1.5"
          >
            Ok
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CommandTriggeredModals;
