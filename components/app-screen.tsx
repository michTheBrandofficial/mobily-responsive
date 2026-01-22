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
import { cn } from "@/lib/cn";

// default canfig is iphone
const AppScreen = ({
	config = "iphone",
	// topPadding,
}: {
	config: "base" | "iphone";
	topPadding?: string;
}) => {
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
				animation.current = appScreenEl.animate(
					animationKeyFrames,
					animationOptions,
				);
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
			className={cn(
				"tws-size-full tws-absolute tws-z-[800] tws-bg-transparent tws-top-0 tws-left-0 tws-rounded-[var(--radius)] ",
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
			<div className="tws-peer tws-size-full tws-bg-white ">
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
