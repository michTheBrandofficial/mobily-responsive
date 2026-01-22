import { cn } from "@/lib/cn";
import { uint8 } from "@/lib/number";
import { pipe } from "@/lib/pipe";
import { hexToRgbArray, percentage, rgbArrayToHex } from "@/lib/utils";
import { HTMLElements, HTMLMotionProps, motion } from "motion/react";
import * as React from "react";
import "./liquid-glass.css";
import { memo } from "react";

export type HexColor = `#${string}`;

export type RgbColor = [uint8, uint8, uint8];

interface LiquidGlassProps extends Omit<
	HTMLMotionProps<"div">,
	"children" | "color"
> {
	children?: React.ReactNode;
	color?: HexColor | RgbColor;
	/**
	 * @dev tint is the white tint around the liquid glass,
	 * @default white
	 * @cancustomize to use {@link LiquidGlassProps.color} or custom color
	 */
	tint?: "use-color" | RgbColor;
	/**
	 * @default .07
	 */
	tintOpacity?: number;
	mixingPercentage?: number;
}

type LiquidGlassHtmlElements = {
	[Tag in keyof HTMLElements]: React.FunctionComponent<
		Omit<HTMLMotionProps<Tag>, "children" | "color"> & {
			children?: React.ReactNode;
			color?: HexColor | RgbColor;
			/**
			 * @dev tint is the white tint around the liquid glass,
			 * @default white
			 * @cancustomize to use {@link LiquidGlassProps.color} or custom color
			 */
			tint?: "use-color" | RgbColor;
			/**
			 * @default .07
			 */
			tintOpacity?: number;
			/**
			 * @dev mixing percentage meaning the percentage of {@link LiquidGlassProps.color} contributed to the glass. Expressed in whole numbers from 0 to 100.
			 * @default 12
			 */
			mixingPercentage?: number;
		}
	>;
};

const LiquidGlassImplMemoized = memo(function LiquidGlassImpl({
	children,
	className,
	style = {},
	color = `#bbbbbc`,
	tint,
	tintOpacity = 0.07,
	mixingPercentage = 12,
	tag,
	...props
}: LiquidGlassProps & { tag: keyof HTMLElements }) {
	const [hex, rgb] = pipe(color, (color): [HexColor, RgbColor] => {
		if (typeof color === "string") return [color, hexToRgbArray(color)];
		else if (Array.isArray(color)) return [rgbArrayToHex(color), color];
		return ["#bbbbbc", hexToRgbArray("#bbbbbc")];
	});
	const MotionComponent = motion[tag as "div"];
	return (
		<MotionComponent
			{...props}
			className={cn("liquid-glass", className)}
			style={{
				// this is what styles the glass color
				...style,
				// @ts-ignore
				"--c-glass": hex,
				"--mixing-percentage": percentage(mixingPercentage),
				...(tint
					? {
							// pass the color here for the tint around
							"--c-light":
								tint === "use-color"
									? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${tintOpacity})`
									: `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${tintOpacity})`,
						}
					: {}),
			}}
		>
			{children}
		</MotionComponent>
	);
});

const componentCache = new Map<string, React.FunctionComponent<any>>();

const LiquidGlass = new Proxy({} as LiquidGlassHtmlElements, {
	get(_, property) {
		const tag = property as string;

		// Return cached component if it exists
		if (componentCache.has(tag)) {
			return componentCache.get(tag)!;
		}

		// Create and cache the component
		const Component = (props: any) => (
			<LiquidGlassImplMemoized {...props} tag={tag} />
		);

		componentCache.set(tag, Component);
		return Component;
	},
});

export default LiquidGlass;
