import { getDims, px, round } from "@/lib/utils";
import { BasePhoneConfig, basePhoneConfig } from "./base-phone-config";
import clothoidize from "@/lib/clothoidize";
import { lastHasBezels } from "../constants";
import { Dispatch, RefObject, useEffect } from "react";
import { create } from "zustand/react";

export interface IphoneConfig extends BasePhoneConfig {}

export const iphoneConfig: IphoneConfig = {
  ...basePhoneConfig,
  ...{},
  hasBezels: lastHasBezels === "true",
};

type IPhoneConfigStore = {
  iphoneConfig: IphoneConfig;
  setIphoneConfig: Dispatch<IphoneConfig>;
};

export const useIphoneConfig = create<IPhoneConfigStore>((set, get) => ({
  iphoneConfig,
  setIphoneConfig: (config) => {
    set({
      ...get(),
      iphoneConfig: config,
    });
  },
}));

type IphoneConfigRatios<T = number> = {
  deviceWidthRatio: T;
  deviceHeightRatio: T;
  virtualHomeButtonRatio: T;
  /**
   * @deprecated use clothoidRadiusRatio instead
   */
  borderRadiusRatio?: T;
  clothoidRadiusRatio: T;
  deviceBarRatios: readonly [T, T];
  safeAreaInsetRatio: T;
};

/**
 * sets up an effect to to resize the device frame when ever the window is resized;
 */
export const setupResizeEffect = <E extends HTMLElement>(
  wrapperRef: RefObject<E | null>,
  resizeEffectConfig: IphoneConfigRatios,
  fn?: (target: E) => void,
) => {
  const { iphoneConfig, setIphoneConfig } = useIphoneConfig();
  const {
    deviceBarRatios,
    deviceHeightRatio,
    virtualHomeButtonRatio,
    deviceWidthRatio,
    clothoidRadiusRatio,
    safeAreaInsetRatio,
  } = resizeEffectConfig;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const [{ target }] = entries;
      const { width, height } = getDims(getComputedStyle(target!));
      const { newWidth, newHeight } = (() => ({
        newWidth: width - round(width * deviceWidthRatio),
        newHeight: height - round(height * deviceHeightRatio),
      }))();
      setIphoneConfig({
        ...iphoneConfig,
        width: px(newWidth),
        height: px(newHeight),
        virtualHomeButtonWidth: px(round(width * virtualHomeButtonRatio)),
        clothoidRadius: clothoidize({
          format: "minify",
          precise: 100,
          radius: round(width * clothoidRadiusRatio),
          unit: "px",
        }),
        borderRadius: px(round(width * clothoidRadiusRatio)),
        deviceBarRatios: {
          top: px(round(height * deviceBarRatios[0])),
          bottom: px(round(height * deviceBarRatios[1])),
        },
        safeAreaInset: px(round(height * safeAreaInsetRatio)),
      });
      fn?.(wrapperRef.current!);
    });
    observer.observe(wrapperRef.current!);
    return () => {
      observer.disconnect();
    };
  }, [resizeEffectConfig]);
};
