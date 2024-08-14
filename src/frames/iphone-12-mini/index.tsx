import Wallpaper from '@/assets/images/iphone home screen 2.jpg';
import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { percentage, pick, px } from "@/lib/utils";
import { callRef } from "nixix/primitives";
import { Container } from "nixix/view-components";
import { containerStyles } from "~/constants";
import { setupResizeEffect, useIphoneConfig } from "~/stores/iphone-config";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

type Props = App.DeviceProps;

const testingDimensions = { w: 357.033, h: 717.433 };

const deviceWidthRatio = 41 / testingDimensions.w;

const deviceHeightRatio = 36 / testingDimensions.h;

const safeAreaInsetRatio = 36 / testingDimensions.h;

const deviceBarRatios = [
  18 / testingDimensions.h,
  6 / testingDimensions.h,
] as const;

const virtualHomeButtonRatio = 110 / testingDimensions.h;

const clothoidRadiusRatio = 36 / testingDimensions.w;

const Iphone12Mini: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const wrapperRef = callRef<HTMLElement>();
  const { iphoneConfig } = useIphoneConfig()
  setupResizeEffect(wrapperRef, {
    deviceBarRatios,
    deviceHeightRatio,
    deviceWidthRatio,
    clothoidRadiusRatio,
    virtualHomeButtonRatio,
    safeAreaInsetRatio,
  });
  return (
    <Wrapper bind:ref={wrapperRef}>
      <DeviceFrame />
      <Container
        style={{
          ...pick(iphoneConfig, "width", "height"),
          ...containerStyles,
        clipPath: iphoneConfig.clothoidRadius,
        background: `url(${Wallpaper})`,
        backgroundSize: 'cover'
      }} >
        <Container style={{
          paddingTop: iphoneConfig.safeAreaInset,
          width: percentage(100),
          height: percentage(100),
          clipPath: 'inherit',
          overflow: 'hidden',
          position: 'relative'
        }} >
          <StatusBar style={{
            width: iphoneConfig.width,
            position: 'absolute',
            top: px(0),
            zIndex: 900,
          }} />
          <HomeScreen iframeSrc={iframeSrc} />
          <AppScreen iframeSrc={iframeSrc} />
        </Container>
      </Container>
    </Wrapper>
  );
};

export default Iphone12Mini;
