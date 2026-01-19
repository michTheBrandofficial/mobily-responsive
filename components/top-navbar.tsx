import { cn } from "@/lib/cn";
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
import { maxHeightMap, useDeviceFrameHeight } from "@/src/constants";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useFullscreen } from "@/src/stores/fullscreen";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useLocalStorage } from "@/src/stores/local-storage";
import { useScreenState } from "@/src/stores/screen-state";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { FormikProps, useFormik } from "formik";
import { Check, Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
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
import Popover from "./ui/popover";
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
	const simulatorAppWindow = getCurrentWindow();
	const {
		storage: { lastUsedDevice: device },
	} = useLocalStorage();
	const deviceDisplayName = pick(
		DEVICE_MAPPING[device],
		"displayName",
		"version",
	);
	const versionMemo = pipe(DEVICE_MAPPING[device], ({ type, version }) => {
		return inlineSwitch(type, ["ipad", `iPadOS ${version}`], {
			default: `iOS ${version}`,
		});
	});
	const { isFullscreen, setIsFullscreen } = useFullscreen();
	const { setScreenState } = useScreenState();
	const { setDeviceFrameHeightClass } = useDeviceFrameHeight();
	const { setDeviceScreen } = useDeviceScreen();
	const classMemo = isFullscreen ? "tws-hidden" : "tws-flex";
	const [mixingPercentage, setMixingPercentage] = useState(12);
	useEffect(() => {
		function onBlur() {
			setMixingPercentage(0);
		}
		function onFocus() {
			setMixingPercentage(2);
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
				`tws-w-screen tws-max-w-[354px] tws-items-center tws-justify-between tws-gap-3 tws-p-2 tws-pb-2 tws-pr-2.5 tws-relative tws-z-[500] tws-rounded-full `,
				`tws-bg-[#1E1E1E] `,
				`tws-shadow-[0px_0px_1px_0.5px_rgba(231,229,228,0.6),_0px_0px_1px_2px_rgba(0,0,0,0.6)] `,
				classMemo,
			)}
		>
			<div className="tws-p-2 tws-px-3 tws-flex tws-items-center tws-gap-x-2.5 tws-rounded-full">
				<Button
					whileHover={undefined}
					onTap={() => simulatorAppWindow.close()}
					className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#460804] !tws-p-0 tws-rounded-full !tws-bg-red-400 hover:!tws-bg-red-500 tws-transition-colors tws-duration-150 tws-group "
				>
					<XIcon className="tws-size-3 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
				</Button>
				<Button
					whileHover={undefined}
					onTap={() => simulatorAppWindow.minimize()}
					className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#90591d] !tws-p-0 tws-rounded-full !tws-bg-yellow-400 hover:!tws-bg-yellow-500 tws-transition-colors tws-duration-150 tws-group "
				>
					<MinusIcon className="tws-size-3 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
				</Button>
				<Button
					whileHover={undefined}
					onTap={() => {
						setIsFullscreen(true);
						setDeviceFrameHeightClass(maxHeightMap.fullscreen);
					}}
					className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#2a6218] !tws-p-0 tws-rounded-full !tws-bg-green-400 hover:!tws-bg-green-500 tws-transition-colors tws-duration-150 tws-group "
				>
					<Maximize2Icon className="tws-size-2 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
				</Button>
			</div>
			<div className="tws-flex tws-flex-col tws-justify-center tws-text-xs -tws-space-y-0.5 ">
				<p className="tws-text-white tws-font-bold ">
					{deviceDisplayName.displayName}
				</p>
				<p className="tws-text-stone-400 tws-font-medium ">
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
					<Home className={"tws-size-[18px] tws-fill-white"} />
				</Button>
				<UrlInputPopover
					trigger={
						<SearchIcon
							className={"tws-size-[18px] tws-h-[16px] tws-fill-white"}
						/>
					}
					formik={formik}
					onSave={async () => {
						setIframeSrc(
							`${formik.values.protocol}${removeLeadingSlash(formik.values.url)}`,
						);
					}}
				/>
				{/* device select menu here */}
				<DeviceSelectMenu
					trigger={
						<DeviceFrameIcon className={"tws-size-[18px] tws-text-white "} />
					}
				/>
				<AppSettingsMenu
					trigger={<Settings className={"tws-size-[18px] tws-fill-white"} />}
				/>
			</LiquidGlass.div>
		</section>
	);
};

interface UrlInputPopoverProps {
	trigger: ReactNode;
	formik: FormikProps<UrlFormikType>;
	onSave(): void;
}

const UrlInputPopover: React.FC<UrlInputPopoverProps> = (props) => {
	const { formik, onSave } = props;
	const { deviceScreen } = useDeviceScreen();
	const inputRef = useRef<HTMLTextAreaElement>(null);

	return (
		<Popover
			transformOrigin="top"
			onOpen={async () => {
				await sleep(500);
				inputRef.current?.focus();
			}}
			className="!tws-m-0"
		>
			<Popover.Trigger
				className="tws-cursor-pointer"
				layout
				initial={false}
				animate={
					deviceScreen === "home-screen"
						? {
								opacity: 0,
								width: 0,
								marginLeft: 0,
							}
						: {
								opacity: 1,
								width: "auto",
								marginLeft: 16,
							}
				}
				transition={{
					delay: 0.9,
					duration: 0.2,
				}}
			>
				{props.trigger}
			</Popover.Trigger>
			<Popover.Content className="tws-max-w-72 tws-bg-white/80 tws-rounded-[28px] tws-top-[200%] -tws-right-[200%] tws-p-4 tws-pt-3.5 ">
				{(closePopover) => {
					return (
						<div>
							<div className="tws-flex tws-flex-col tws-px-1 ">
								<Typography.p className="tws-text-base tws-font-semibold tws-font-SF_Pro_Display tws-text-zinc-900 tws-mb-1 ">
									Add URL
								</Typography.p>
								<Typography.p className="tws-text-sm tws-leading-5 tws-w-full tws-font-Switzer tws-text-wrap tws-font-normal tws-text-zinc-900">
									Enter your site's URL to preview it on this device.
								</Typography.p>
							</div>
							<div className="tws-min-w-[220px] tws-h-fit tws-py-2 tws-px-4 tws-mt-6 tws-bg-zinc-300 tws-rounded-[24px] ">
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
									className="tws-caret-zinc-950  "
									name="url"
									placeholder="Url e.g acme.com"
								/>
							</div>
							<div className="tws-mt-4 tws-flex tws-items-center tws-gap-x-2.5 ">
								<Button
									onTap={closePopover}
									className="!tws-rounded-[24px] !/tws-bg-[#bfb9c9] !tws-bg-zinc-300 tws-w-full !tws-py-2"
									variant="dormant"
								>
									Cancel
								</Button>
								<Button
									onTap={async () => {
										closePopover();
										await sleep(300);
										onSave();
									}}
									disabled={!formik.isValid}
									className="!tws-rounded-[24px] tws-w-full !tws-py-2"
								>
									Ok
								</Button>
							</div>
						</div>
					);
				}}
			</Popover.Content>
		</Popover>
	);
};

export default TopNavbar;
