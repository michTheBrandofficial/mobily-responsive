import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { cn } from "@/lib/cn";
import { px } from "@/lib/utils";
import { useScreenState } from "@/src/stores/screen-state";
import { FC, memo, useMemo, useRef } from "react";
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

const Iphone17Pro: FC = () => {
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
				return `tws-wallpaper-iphone-17-pro`;
			default:
				return `tws-wallpaper-iphone-17-pro`;
		}
	}, [screenState]);
	return (
		<Wrapper
			ref={wrapperRef}
			className="tws-w-fit tws-h-full tws-flex tws-items-center tws-justify-center "
		>
			<DeviceFrame>
				<div className={cn(`tws-size-full tws-bg-cover `, backgroundMemo)}>
					<div
						className="tws-relative tws-size-full "
						style={{
							paddingTop: iphoneConfig.safeAreaInset,
							position: "relative",
						}}
					>
						<StatusBar
							className="tws-z-[900] "
							style={{
								width: "100%",
								position: "absolute",
								top: px(0),
							}}
						/>
						<HomeScreen />
						<AppScreen config="iphone" />
					</div>
				</div>
			</DeviceFrame>
		</Wrapper>
	);
};

export default memo(Iphone17Pro);
