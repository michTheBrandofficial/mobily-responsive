import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { pick, px } from "@/lib/utils";
import { Show } from "nixix/hoc";
import { callRef, concat } from "nixix/primitives";
import { Container } from "nixix/view-components";
import VirtualHomeButton from "~/components/virtual-home-button";
import { containerStyles } from "~/constants";
import { deviceScreen } from "~/stores/device-screen";
import { $deviceSettings } from "~/stores/device-settings";
import { $iphoneConfig, setupResizeEffect } from "~/stores/iphone-config";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

type Props = App.DeviceProps

// 352.467 and 717.433 are the dimensions which was tested for the iphone frame. It should be what we use to get our ratios for resizing of the iframe container;
const testingDimensions = {
  w: 352.467,
  h: 717.433
}

const deviceWidthRatio = 36 / testingDimensions.w;

const deviceHeightRatio = 32 / testingDimensions.h;

const safeAreaInsetRatio = 49 / testingDimensions.h;

const virtualHomeButtonRatio = 120 / testingDimensions.h;

const clothoidRadiusRatio = 43 / testingDimensions.w;

const deviceBarRatios = [15 / testingDimensions.h, 20 / testingDimensions.h] as const

const Iphone14ProMax: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const wrapperRef = callRef<HTMLElement>();
  setupResizeEffect(wrapperRef, {
    deviceBarRatios,
    deviceHeightRatio,
    deviceWidthRatio,
    clothoidRadiusRatio,
    virtualHomeButtonRatio,
    safeAreaInsetRatio
  })

  const whenClause = () => deviceScreen.value === 'tws-app-screen'
  return (
    <Wrapper bind:ref={wrapperRef} >
      <DeviceFrame />
      <Container className={concat`tws-h-auto tws-w-auto ${deviceScreen} tws-transition-[background] tws-duration-300 tws-ease-[ease] `} style={{
        ...pick($iphoneConfig, 'width', 'height'),
        ...containerStyles,
        clipPath: $iphoneConfig.clothoidRadius,
        paddingTop: $iphoneConfig.safeAreaInset,
      }} >
        <StatusBar style={{
          width: $iphoneConfig.width,
          position: 'absolute',
          top: px(0),
          zIndex: 400,
          backgroundColor: $deviceSettings.theme_color
        }} />
        <HomeScreen iframeSrc={iframeSrc} />
        <AppScreen iframeSrc={iframeSrc} />
      </Container>
      <Show when={whenClause} >
        <VirtualHomeButton style={{
          width: $iphoneConfig.virtualHomeButtonWidth,
          position: 'absolute',
          bottom: $iphoneConfig.deviceBarRatios.bottom,
          zIndex: 400,
          backgroundColor: '#080808'
        }} />
      </Show>
    </Wrapper>
  )
}

export default Iphone14ProMax;