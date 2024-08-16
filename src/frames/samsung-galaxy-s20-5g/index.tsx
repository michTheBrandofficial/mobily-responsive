import Wallpaper from '@/assets/images/samsung wallpaper.webp';
import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { percentage, pick, px } from "@/lib/utils";
import { callRef } from "nixix/primitives";
import { Container } from "nixix/view-components";
import { containerStyles } from "~/constants";
import { setupResizeEffect, useBasePhoneConfig } from '~/stores/base-phone-config';
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

type Props = App.DeviceProps;

const testingDimensions = { w: 357.033, h: 717.433 };

const deviceWidthRatio = 23 / testingDimensions.w;

const deviceHeightRatio = 28 / testingDimensions.h;

const safeAreaInsetRatio = 38 / testingDimensions.h;

const deviceBarRatios = [18 / testingDimensions.h, 6 / testingDimensions.h] as const

const virtualHomeButtonRatio = 110 / testingDimensions.h;

const borderRadiusRatio = 36 / testingDimensions.w;

const SamsungS205G: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const wrapperRef = callRef<HTMLElement>();
  const { basePhoneConfig } = useBasePhoneConfig()
  setupResizeEffect(wrapperRef, {
    deviceBarRatios,
    deviceHeightRatio,
    deviceWidthRatio,
    borderRadiusRatio,
    virtualHomeButtonRatio,
    safeAreaInsetRatio
  });
  
  return (
    <Wrapper bind:ref={wrapperRef} >
      <DeviceFrame />
      <Container style={{
        ...pick(basePhoneConfig, 'width', 'height', 'borderRadius'),
        ...containerStyles,
        // marginRight because the controls of this device contribute to the width
        marginRight: px(2),
        marginBottom: px(6),
        clipPath: basePhoneConfig.clothoidRadius,
        background: `url(${Wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} >
        <Container style={{
          paddingTop: basePhoneConfig.safeAreaInset,
          width: percentage(100),
          height: percentage(100),
          clipPath: 'inherit',
          overflow: 'hidden',
          position: 'relative'
        }} >
          <StatusBar style={{
            width: basePhoneConfig.width,
            position: 'absolute',
            top: px(0),
            zIndex: 900,
            backgroundColor: 'transparent'
          }} />
          <HomeScreen iframeSrc={iframeSrc} />
          <AppScreen config='base' iframeSrc={iframeSrc} />
        </Container>
      </Container>
    </Wrapper>
  )
};

export default SamsungS205G;
