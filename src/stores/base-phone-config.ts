import clothoidize from "@/lib/clothoidize";
import { getDims, px, round } from "@/lib/utils";
import { Dispatch, RefObject, useEffect } from "react";
import { create } from "zustand/react";

export interface BasePhoneConfig<T = string> {
  width: T;
  height: T;
  virtualHomeButtonWidth: T;
  clothoidRadius: string;
  deviceBarRatios: {
    top: T;
    bottom: T;
  };
  hasBezels?: boolean;
  borderRadius: T;
  safeAreaInset: T;
}

export const basePhoneConfig: BasePhoneConfig = {
  width: "",
  height: "",
  virtualHomeButtonWidth: "",
  clothoidRadius: "",
  deviceBarRatios: {
    top: "",
    bottom: "",
  },
  safeAreaInset: "",
  borderRadius: "",
};

type BasePhoneConfigStore = {
  basePhoneConfig: BasePhoneConfig;
  setBasePhoneConfig: Dispatch<BasePhoneConfig>;
};

export const useBasePhoneConfig = create<BasePhoneConfigStore>((set, get) => ({
  basePhoneConfig,
  setBasePhoneConfig: (config) => {
    set({
      ...get(),
      basePhoneConfig: config,
    });
  },
}));

type BasePhoneConfigRatios<T = number> = {
  deviceWidthRatio: T;
  deviceHeightRatio: T;
  virtualHomeButtonRatio: T;
  borderRadiusRatio: T;
  deviceBarRatios: readonly [T, T];
  safeAreaInsetRatio: T;
};

/**
 * sets up an effect to to resize the device frame when ever the window is resized;
 */
export const setupResizeEffect = <E extends HTMLElement>(
  wrapperRef: RefObject<E | null>,
  resizeEffectConfig: BasePhoneConfigRatios,
  fn?: (target: E) => void,
) => {
  const { setBasePhoneConfig } = useBasePhoneConfig();
  const {
    deviceBarRatios,
    deviceHeightRatio,
    virtualHomeButtonRatio,
    borderRadiusRatio,
    deviceWidthRatio,
    safeAreaInsetRatio,
  } = resizeEffectConfig;
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const [{ target }] = entries;
      const { width, height } = getDims(getComputedStyle(target!));
      setBasePhoneConfig({
        width: px(width - round(width * deviceWidthRatio)),
        height: px(height - round(height * deviceHeightRatio)),
        virtualHomeButtonWidth: px(round(height * virtualHomeButtonRatio)),
        clothoidRadius: clothoidize({
          radius: round(width * borderRadiusRatio),
          format: "minify",
          precise: 15,
          unit: "px",
        }),
        borderRadius: px(round(width * borderRadiusRatio)),
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
