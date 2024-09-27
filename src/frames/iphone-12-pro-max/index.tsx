import Wallpaper from '@/assets/images/iphone 12 wallpaper.jpg';
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

const dimensions = { w: 428, h: 926 };

const deviceWidthRatio = 46 / dimensions.w;

const deviceHeightRatio = 46 / dimensions.h;

const safeAreaInsetRatio = 55 / dimensions.h;

const deviceBarRatios = [
  18 / dimensions.h,
  6 / dimensions.h,
] as const;

const virtualHomeButtonRatio = 145 / dimensions.w;

const clothoidRadiusRatio = 46 / dimensions.w;

const Iphone12ProMax: Nixix.FC<Props> = ({ iframeSrc }): someView => {
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
      <DeviceFrame height={dimensions.h} />
      <Container
        style={{
          ...pick(iphoneConfig, "width", "height"),
          ...containerStyles,
          clipPath: iphoneConfig.clothoidRadius,
          background: `url(${Wallpaper})`,
          backgroundSize: 'cover',
          marginRight: '0px'
        }} >
          <Container style={{
            paddingTop: iphoneConfig.safeAreaInset,
            width: percentage(100),
            height: percentage(100),
            clipPath: 'inherit',
            borderRadius: 'inherit',
            overflow: 'hidden',
            position: 'relative'
          }} >
            <StatusBar style={{
              width: iphoneConfig.width,
              position: 'absolute',
              top: px(0),
              zIndex: 300,
            }} />
            <HomeScreen iframeSrc={iframeSrc} />
            <AppScreen config="iphone" iframeSrc={iframeSrc} />
          </Container>
      </Container>
    </Wrapper>
  );
};

export default Iphone12ProMax;
