import Iframe from "@/components/iframe";
import Wrapper from "@/components/wrapper";
import { pick, px } from "@/lib/utils";
import { callRef } from "nixix/primitives";
import { Container } from "nixix/view-components";
import { containerStyles } from "~/constants";
import { setupResizeEffect, useBasePhoneConfig } from '~/stores/base-phone-config';
import { useDeviceSettings } from "~/stores/device-settings";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";
import VirtualHomeButton from "./svg/virtual-home-button";

type Props = App.DeviceProps;

const testingDimensions = { w: 357.033, h: 717.433 };

const deviceWidthRatio = 23 / testingDimensions.w;

const deviceHeightRatio = 28 / testingDimensions.h;

const safeAreaInsetRatio = 38 / testingDimensions.h;

const deviceBarRatios = [18 / testingDimensions.h, 22 / testingDimensions.h] as const

const virtualHomeButtonRatio = 110 / testingDimensions.h;

const borderRadiusRatio = 36 / testingDimensions.w;

const SamsungS205G: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const wrapperRef = callRef<HTMLElement>();
  const { deviceSettings} = useDeviceSettings()
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
        paddingTop: basePhoneConfig.safeAreaInset,
        // marginRight because the controls of this device contribute to the width
        marginRight: px(2),
        marginBottom: px(6),
        backgroundColor: 'white'
      }} >
        <StatusBar 
          style={{
          width: basePhoneConfig.width,
          position: 'absolute',
          top: px(0),
          zIndex: 900,
          backgroundColor: deviceSettings.theme_color
        }} />
        <Iframe src={iframeSrc|| 'http://localhost:3000'} />
      </Container>
      <VirtualHomeButton style={{
        width: basePhoneConfig.virtualHomeButtonWidth,
        position: 'absolute',
        bottom: basePhoneConfig.deviceBarRatios.bottom,
        zIndex: 400
      }} />
    </Wrapper>
  )
};

export default SamsungS205G;
