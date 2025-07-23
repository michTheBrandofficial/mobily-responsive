import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { percentage, pick, px } from "@/lib/utils";
import { concat, memo, ref } from "nixix/primitives";
import { Container } from "nixix/view-components";
import { containerStyles } from "~/constants";
import { setupResizeEffect, useIphoneConfig } from "~/stores/iphone-config";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";
import { useScreenState } from "@/src/stores/screen-state";

type Props = App.DeviceProps;

const dimensions = {
	w: 393,
	h: 852,
};

const deviceWidthRatio = 65 / dimensions.w;

const deviceHeightRatio = 73 / dimensions.h;

const safeAreaInsetRatio = 60 / dimensions.h;

const virtualHomeButtonRatio = 115 / dimensions.w;

const clothoidRadiusRatio = 49 / dimensions.w;

const deviceBarRatios = [15 / dimensions.h, 6 / dimensions.h] as const;

const Iphone15: Nixix.FC<Props> = ({ iframeSrc }): someView => {
	const wrapperRef = ref<HTMLElement>();
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
	const hasBezelsClassMemo = memo(() => {
		return iphoneConfig.hasBezels!.value ? " " : " tws-invisible ";
	}, [iphoneConfig.hasBezels!]);
	const backgroundMemo = memo(() => {
		switch (screenState.value) {
			case "after-app-launch":
				return `tws-wallpaper-after-app-launch`;
			case "before-close-app":
				return `tws-wallpaper-iphone-15`;
			default:
				return `tws-wallpaper-iphone-15`;
		}
	}, [screenState]);
	return (
		<Wrapper bind:ref={wrapperRef}>
			<DeviceFrame height={dimensions.h} className={hasBezelsClassMemo} />
			<Container
				className={concat`tws-h-auto tws-w-auto ${backgroundMemo}`}
				style={{
					...pick(iphoneConfig, "width", "height"),
					...containerStyles,
					clipPath: iphoneConfig.clothoidRadius,
					backgroundSize: "cover",
				}}
			>
				<Container
					style={{
						paddingTop: iphoneConfig.safeAreaInset,
						width: percentage(100),
						height: percentage(100),
						clipPath: "inherit",
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
					<HomeScreen iframeSrc={iframeSrc} />
					<AppScreen config="iphone" iframeSrc={iframeSrc} />
				</Container>
			</Container>
		</Wrapper>
	);
};

export default Iphone15;
