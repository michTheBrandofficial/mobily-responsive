import { cn } from "@/lib/cn";
import { uint8 } from "@/lib/number";
import { HTMLElements, HTMLMotionProps } from "motion/react";
import * as React from "react";
import "./liquid-glass.css";
import { memo, useMemo, useRef } from "react";
import { getDisplacementMapDataUri } from "./displacement-map";
import useMeasure from "./use-measure";

export type HexColor = `#${string}`;

export type RgbColor = [uint8, uint8, uint8];

// Note: color/tint props are not yet wired in the new implementation
// They are kept in the interface for backwards compatibility

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

  // ========== NEW REFRACTION CONTROLS ==========
  /**
   * Red channel displacement scale (horizontal)
   * Negative = distort left, Positive = distort right
   * @default -180
   */
  refractionRed?: number;

  /**
   * Green channel displacement scale
   * @default -170
   */
  refractionGreen?: number;

  /**
   * Blue channel displacement scale
   * @default -160
   */
  refractionBlue?: number;

  /**
   * Gaussian blur after displacement
   * @default 0
   */
  refractionBlur?: number;

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

      // Refraction controls
      refractionRed?: number;
      refractionGreen?: number;
      refractionBlue?: number;
      refractionBlur?: number;
      saturation?: number;
    }
  >;
};

const LiquidGlassImplMemoized = memo(function LiquidGlassImpl({
  children,
  className,
  refractionRed = -180,
  refractionGreen = -170,
  refractionBlue = -160,
  refractionBlur = 0,
  saturation = 1,
  ...props
}: LiquidGlassProps & { tag: keyof HTMLElements }) {
  // Generate displacement map data URI with custom settings
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const displacementHref = useMemo(
    () => getDisplacementMapDataUri({ width, height }),
    [width, height]
  );
  return (
    // <MotionComponent
    //   {...props}
    // {/*{children}*/}

    // @ts-ignore
    <div
      {...props}
      ref={ref}
      className={cn("glass-effect", className)}
      style={{
        // @ts-ignore - CSS custom properties
        "--glass-saturation": saturation,
      }}
    >
      {children}
      <svg
        className="glass-filter"
        xmlns="http://www.w3.org/2000/svg"
        style={{ touchAction: "none" }}
      >
        <defs style={{ touchAction: "none" }}>
          <filter
            id="filter"
            color-interpolation-filters="sRGB"
            style={{ touchAction: "none" }}
          >
            <feImage
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="map"
              style={{ touchAction: "none" }}
              href={displacementHref}
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
              stdDeviation={refractionBlur}
              style={{ touchAction: "none" }}
            ></feGaussianBlur>
          </filter>
        </defs>
      </svg>
    </div>
    // </MotionComponent>
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
