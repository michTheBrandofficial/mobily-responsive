import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { cn } from "@/lib/cn";
import { percentage, pick, px } from "@/lib/utils";
import { useScreenState } from "@/src/stores/screen-state";
import { FC, memo, useMemo, useRef } from "react";
import { containerStyles } from "~/constants";
import { setupResizeEffect, useIphoneConfig } from "~/stores/iphone-config";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

const dimensions = {
	w: 402,
	h: 874,
};

const deviceWidthRatio = 42 / dimensions.w;

const deviceHeightRatio = 42 / dimensions.h;

const safeAreaInsetRatio = 60 / dimensions.h;

const virtualHomeButtonRatio = 130 / dimensions.w;

const clothoidRadiusRatio = 58 / dimensions.w;

const deviceBarRatios = [15 / dimensions.h, 6 / dimensions.h] as const;

const Iphone16Pro: FC = () => {
	const wrapperRef = useRef<HTMLElement>(null);
	const { iphoneConfig } = useIphoneConfig();
	setupResizeEffect(wrapperRef, {
		deviceBarRatios,
		deviceHeightRatio,
		deviceWidthRatio,
		clothoidRadiusRatio,
		virtualHomeButtonRatio,
		safeAreaInsetRatio,
	});
	const { screenState } = useScreenState();
	const backgroundMemo = useMemo(() => {
		switch (screenState) {
			case "after-app-launch":
				return `tws-wallpaper-after-app-launch`;
			case "before-close-app":
				return `tws-wallpaper-iphone-16-pro`;
			default:
				return `tws-wallpaper-iphone-16-pro`;
		}
	}, [screenState]);
	return (
		<Wrapper ref={wrapperRef} >
			<DeviceFrame height={dimensions.h} className={cn("", {
			  "tws-invisible": iphoneConfig.hasBezels === false
			})} />
			<div
				className={cn(`tws-h-auto tws-w-auto `,
				  backgroundMemo
				)}
				style={{
					...pick(iphoneConfig, "width", "height"),
					...containerStyles,
					clipPath: iphoneConfig.clothoidRadius,
					backgroundSize: "cover",
				}}
			>
				<div
					style={{
						paddingTop: iphoneConfig.safeAreaInset,
						width: percentage(100),
						height: percentage(100),
						overflow: "hidden",
						position: "relative",
					}}
				>
					<StatusBar
						style={{
							width: iphoneConfig.width,
							position: "absolute",
							top: px(0),
							zIndex: 900,
						}}
					/>
					<HomeScreen />
					<AppScreen config="iphone" />
				</div>
			</div>
		</Wrapper>
	);
};

export default memo(Iphone16Pro);
