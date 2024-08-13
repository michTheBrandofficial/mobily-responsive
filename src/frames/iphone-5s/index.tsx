import Iframe from "@/components/iframe";
import Wrapper from "@/components/wrapper";
import { pick, px } from "@/lib/utils";
import { callRef } from "nixix/primitives";
import { Container } from "nixix/view-components";
import { containerStyles } from "~/constants";
import { $deviceSettings } from "~/stores/device-settings";
import { $iphoneConfig, setupResizeEffect } from "~/stores/iphone-config";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

type Props = App.DeviceProps;

const testingDimensions = { w: 357.033, h: 717.433 };

const deviceWidthRatio = 45 / testingDimensions.w;

const deviceHeightRatio = 160 / testingDimensions.h;

const safeAreaInsetRatio = 16 / testingDimensions.h;

const deviceBarRatios = [18 / testingDimensions.h, 22 / testingDimensions.h] as const

const virtualHomeButtonRatio = 110 / testingDimensions.h;

const borderRadiusRatio = 36 / testingDimensions.w;

const Iphone5S: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const wrapperRef = callRef<HTMLElement>()
  setupResizeEffect(wrapperRef, {
    deviceBarRatios,
    deviceHeightRatio,
    deviceWidthRatio,
    borderRadiusRatio,
    virtualHomeButtonRatio,
    safeAreaInsetRatio,
    clothoidRadiusRatio: 0
  })
  return (
    <Wrapper bind:ref={wrapperRef} >
      <DeviceFrame />
      <Container style={{
        ...pick($iphoneConfig, 'width', 'height'),
        ...containerStyles,
        paddingTop: $iphoneConfig.safeAreaInset,
      }} >
        <StatusBar style={{
          width: $iphoneConfig.width,
          position: 'absolute',
          top: px(0),
          zIndex: 900,
          backgroundColor: $deviceSettings.theme_color
        }} />
        <Iframe src={iframeSrc || 'http://localhost:3000'} />
      </Container>
    </Wrapper>
  )
};

export default Iphone5S;
