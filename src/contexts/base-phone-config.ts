import clothoidize from "@/lib/clothoidize";
import { getDims, px, round } from "@/lib/utils";
import { MutableRefObject } from "nixix";
import { effect, store } from "nixix/primitives";

export type BasePhoneConfig<T = string> = {
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
};

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

export const useBasePhoneConfig = (function () {
	const [sbasePhoneConfig, setBasePhoneConfig] =
		store<BasePhoneConfig>(basePhoneConfig);
	return () => ({
		basePhoneConfig: sbasePhoneConfig,
		setBasePhoneConfig,
	});
})();

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
	wrapperRef: MutableRefObject<E | null>,
	{
		deviceBarRatios,
		deviceHeightRatio,
		virtualHomeButtonRatio,
		borderRadiusRatio,
		deviceWidthRatio,
		safeAreaInsetRatio,
	}: BasePhoneConfigRatios,
	fn?: (target: E) => void,
) => {
	const { setBasePhoneConfig } = useBasePhoneConfig();
	effect(() => {
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
	});
};
