import Iframe from "@/components/iframe";
import Wrapper from "@/components/wrapper";
import { pick, px } from "@/lib/utils";
import { callRef } from "nixix/primitives";
import { Container } from "nixix/view-components";
import VirtualHomeButton from "~/components/virtual-home-button";
import { containerStyles } from "~/constants";
import { useDeviceSettings } from "~/stores/device-settings";
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
  22 / testingDimensions.h,
] as const;

const virtualHomeButtonRatio = 120 / testingDimensions.h;

const clothoidRadiusRatio = 36 / testingDimensions.w;

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
      <DeviceFrame />
      <Container
        style={{
          ...pick(iphoneConfig, "width", "height"),
          ...containerStyles,
          clipPath: iphoneConfig.clothoidRadius,
          paddingTop: iphoneConfig.safeAreaInset,
          backgroundColor: "white",
        }}
      >
        <StatusBar
          style={{
            width: iphoneConfig.width,
            position: "absolute",
            top: px(-4),
            zIndex: 900,
            backgroundColor: useDeviceSettings().deviceSettings.theme_color
          }}
        />
        <Iframe src={iframeSrc || "http://localhost:3000"} />
      </Container>
      <VirtualHomeButton
        style={{
          width: iphoneConfig.virtualHomeButtonWidth,
          position: "absolute",
          bottom: iphoneConfig.deviceBarRatios.bottom,
          zIndex: 900,
        }}
      />
    </Wrapper>
  );
};

export default Iphone12ProMax;
