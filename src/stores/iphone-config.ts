import { getDims, px, round } from "@/lib/utils";
import { MutableRefObject } from "nixix";
import { effect, store } from "nixix/primitives";
import { BasePhoneConfig, basePhoneConfig } from "./base-phone-config";
import clothoidize from "@/lib/clothoidize";

export interface IphoneConfig extends BasePhoneConfig {}

export const iphoneConfig: IphoneConfig = {
  ...basePhoneConfig,
  ...{},
};

export const useIphoneConfig = (function () {
  const [siphoneConfig, setIphoneConfig] = store<BasePhoneConfig>(iphoneConfig);
  return () => ({
    iphoneConfig: siphoneConfig,
    setIphoneConfig,
  });
})();

type BaseIphoneConfigRatios<T = number> = {
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
 * modifies the iphoneConfig store object
 */
export const setupResizeEffect = <E extends HTMLElement>(
  wrapperRef: MutableRefObject<E | null>,
  {
    deviceBarRatios,
    deviceHeightRatio,
    virtualHomeButtonRatio,
    clothoidRadiusRatio,
    deviceWidthRatio,
    safeAreaInsetRatio,
  }: BaseIphoneConfigRatios,
  fn?: (target: E) => void
) => {
  effect(() => {
    const observer = new ResizeObserver((entries) => {
      const [{ target }] = entries;
      const { width, height } = getDims(getComputedStyle(target!));
      const { newWidth, newHeight } = (() => ({
        newWidth: width - round(width * deviceWidthRatio),
        newHeight: height - round(height * deviceHeightRatio),
      }))()
      useIphoneConfig().setIphoneConfig({
        width: px(newWidth),
        height: px(newHeight),
        virtualHomeButtonWidth: px(round(width * virtualHomeButtonRatio)),
        clothoidRadius: clothoidize({
        format: 'minify',
        precise: 100,
        radius: round(width * clothoidRadiusRatio),
        unit: 'px'
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
  });
};
