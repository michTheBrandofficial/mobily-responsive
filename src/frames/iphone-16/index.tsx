import Wallpaper from '@/assets/images/iphone 14 wallpaper.jpg';
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

type Props = App.DeviceProps

// 352.467 and 717.433 are the dimensions which was tested for the iphone frame. It should be what we use to get our ratios for resizing of the iframe container;
const dimensions = {
  w: 402,
  h: 874
}

const deviceWidthRatio = 42 / dimensions.w;

const deviceHeightRatio = 42 / dimensions.h;

const safeAreaInsetRatio = 60 / dimensions.h;

const virtualHomeButtonRatio = 130 / dimensions.w;

const clothoidRadiusRatio = 58 / dimensions.w;

const deviceBarRatios = [15 / dimensions.h, 6 / dimensions.h] as const

const Iphone16: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const wrapperRef = callRef<HTMLElement>();
  const { iphoneConfig } = useIphoneConfig()
  setupResizeEffect(wrapperRef, {
    deviceBarRatios,
    deviceHeightRatio,
    deviceWidthRatio,
    clothoidRadiusRatio,
    virtualHomeButtonRatio,
    safeAreaInsetRatio
  })

  return (
    <Wrapper bind:ref={wrapperRef} >
      <DeviceFrame height={dimensions.h} />
      <Container className={`tws-h-auto tws-w-auto tws-transition-[background] tws-duration-300 tws-ease-[ease] `} style={{
        ...pick(iphoneConfig, 'width', 'height'),
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
          <AppScreen config="iphone" iframeSrc={iframeSrc} />
        </Container>
      </Container>
    </Wrapper>
  )
}

export default Iphone16;