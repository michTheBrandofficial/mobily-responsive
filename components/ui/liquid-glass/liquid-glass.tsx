import { cn } from "@/lib/cn";
import { uint8 } from "@/lib/number";
import { HTMLElements, HTMLMotionProps, motion } from "motion/react";
import * as React from "react";
import "./liquid-glass.css";
import { memo, useCallback, useMemo, useRef, useEffect, useState } from "react";
import { getDisplacementMapDataUri } from "./displacement-map";
import useMeasure from "../use-measure";
import { colorToOklch } from "./glass-color";

export type HexColor = `#${string}`;

export type RgbColor = [uint8, uint8, uint8];

interface LiquidGlassProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "color"
> {
  children?: React.ReactNode;
  color?: HexColor | RgbColor;
  /**
   * frosted glass 0 - 1
   * default 0.2
   */
  frost?: 0.2 | (number & {});
  /**
   * Color fringing at the edges of the glass, simulating chromatic aberration
   * Red channel displacement scale (horizontal)
   * when Negative = distort left, Positive = distort right
   * Green channel displacement scale
   * Blue channel displacement scale
   * @default { red: -12, green: -14, blue: -16 }
   * It's best to keep these values negative and incremented by 2 for a natural look, but you can experiment with positive values and different increments for unique effects.
   */
  chromaticAberration?: {
    red: -12 | (number & {});
    green: -14 | (number & {});
    blue: -16 | (number & {});
  };
  /**
   * Gaussian blur after displacement
   * @accepts 0 - 1 decimals
   * @default 0
   */
  blur?: number;
  /**
   * Saturation multiplier for backdrop
   * @default 1
   */
  saturation?: number;
}

type LiquidGlassHtmlElements = {
  [Tag in keyof HTMLElements]: React.FunctionComponent<
    Omit<HTMLMotionProps<Tag>, "children" | "color"> & {
      children?: React.ReactNode;
      color?: HexColor | RgbColor;
      /**
       * frosted glass 0 - 1
       * default 0.2
       */
      frost?: 0.2 | (number & {});
      /**
       * Color fringing at the edges of the glass, simulating chromatic aberration
       * Red channel displacement scale (horizontal)
       * when Negative = distort left, Positive = distort right
       * Green channel displacement scale
       * Blue channel displacement scale
       * @default { red: -12, green: -14, blue: -16 }
       * It's best to keep these values negative and incremented by 2 for a natural look, but you can experiment with positive values and different increments for unique effects.
       */
      chromaticAberration?: {
        red: -12 | (number & {});
        green: -14 | (number & {});
        blue: -16 | (number & {});
      };
      /**
       * Gaussian blur after displacement
       * @accepts 0 - 1 decimals
       * @default 0
       */
      blur?: number;
      saturation?: number;
    }
  >;
};

let filterId = 0;

const LiquidGlassImplMemoized = memo(function LiquidGlassImpl({
  children,
  className,
  tag,
  color,
  frost = 0.2,
  chromaticAberration: {
    red: refractionRed,
    green: refractionGreen,
    blue: refractionBlue,
  } = { red: -12, green: -14, blue: -16 },
  blur = 0,
  saturation = 1,
  ref,
  ...props
}: LiquidGlassProps & { tag: keyof HTMLElements }) {
  // increment filterId for unique filter IDs in case of multiple instances
  ++filterId;

  // Generate displacement map data URI with custom settings
  const [useMeasureRef, { width, height }] = useMeasure<HTMLDivElement>();

  // Cache + threshold + debounce for displacement map
  const cacheRef = useRef<{
    width: number;
    height: number;
    href: string;
  } | null>(null);
  const debounceTimerRef = useRef<any | null>(null);
  const [displacementHref, setDisplacementHref] = useState("");
  const THRESHOLD = 10; // only recalc if size changes by 10+ pixels

  useEffect(() => {
    // Check if change exceeds threshold
    const needsUpdate =
      !cacheRef.current ||
      Math.abs(width - cacheRef.current.width) >= THRESHOLD ||
      Math.abs(height - cacheRef.current.height) >= THRESHOLD;

    if (!needsUpdate) {
      return;
    }

    // Clear existing debounce timer
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // Debounce: wait 300ms after resize stops
    debounceTimerRef.current = setTimeout(() => {
      // Check cache before generating
      if (
        cacheRef.current?.width === width &&
        cacheRef.current?.height === height
      ) {
        setDisplacementHref(cacheRef.current.href);
        return;
      }

      // Generate new displacement map
      const href = getDisplacementMapDataUri({ width, height });
      cacheRef.current = { width, height, href };
      setDisplacementHref(href);
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [width, height]);

  // Create a callback that forwards to both refs
  const mergedRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Forward to useMeasure's ref callback
      useMeasureRef(element as any);

      // Forward to user's ref if it exists
      if (ref) {
        if (typeof ref === "function") {
          ref(element);
        } else {
          ref.current = element;
        }
      }
    },
    [useMeasureRef, ref]
  );

  // Convert color to OKLCH under the hood
  const oklchValues = useMemo(() => {
    if (!color) return { l: 1, c: 0, h: 0 };
    const [l, c, h] = colorToOklch(color);
    return { l, c, h };
  }, [color]);

  const MotionComponent = motion[tag as "div"];
  const filterValue = `url(#${"filter" + filterId}) saturate(${saturation})`;
  return (
    <MotionComponent
      {...props}
      ref={mergedRef}
      className={cn("glass-effect", className)}
      style={{
        background: `oklch(${oklchValues.l}% ${oklchValues.c} ${oklchValues.h} / ${frost})`,
        WebkitBackdropFilter: filterValue,
        backdropFilter: filterValue,
      }}
    >
      {children}
      <svg
        className="glass-filter"
        xmlns="http://www.w3.org/2000/svg"
        style={{ touchAction: "none", zIndex: -1000, pointerEvents: "none" }}
      >
        <defs style={{ touchAction: "none" }}>
          <filter
            id={"filter" + filterId}
            colorInterpolationFilters="sRGB"
            style={{ touchAction: "none" }}
          >
            <feImage
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="map"
              style={{ touchAction: "none" }}
              href={displacementHref || undefined}
            ></feImage>
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              id="redchannel"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispRed"
              style={{ touchAction: "none" }}
              scale={refractionRed}
            ></feDisplacementMap>
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
              style={{ touchAction: "none" }}
            ></feColorMatrix>
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispGreen"
              style={{ touchAction: "none" }}
              scale={refractionGreen}
            ></feDisplacementMap>
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
              style={{ touchAction: "none" }}
            ></feColorMatrix>
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              id="bluechannel"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispBlue"
              style={{ touchAction: "none" }}
              scale={refractionBlue}
            ></feDisplacementMap>
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
              style={{ touchAction: "none" }}
            ></feColorMatrix>
            <feBlend
              in="red"
              in2="green"
              mode="screen"
              result="rg"
              style={{ touchAction: "none" }}
            ></feBlend>
            <feBlend
              in="rg"
              in2="blue"
              mode="screen"
              result="output"
              style={{ touchAction: "none" }}
            ></feBlend>
            <feGaussianBlur
              in="output"
              stdDeviation={blur}
              style={{ touchAction: "none" }}
            ></feGaussianBlur>
          </filter>
        </defs>
      </svg>
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
