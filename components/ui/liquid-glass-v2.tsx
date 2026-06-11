import { cn } from "@/lib/cn";
import { HTMLElements, HTMLMotionProps, motion } from "motion/react";
import * as React from "react";
import { memo, useRef, useEffect, useState } from "react";
import "./liquid-glass-v2.css";

interface LiquidGlassV2Props extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;

  /**
   * Displacement scale - controls refraction strength
   * @default 0.5 (subtle, Apple-like)
   * Range: 0 to 2 typically
   */
  displacementScale?: number;

  /**
   * Blur amount applied BEFORE displacement
   * @default 8
   */
  blur?: number;

  /**
   * Saturation multiplier
   * @default 1.5
   */
  saturation?: number;

  /**
   * Gaussian blur on the displacement itself
   * @default 0.04
   */
  displacementBlur?: number;
}

type LiquidGlassV2HtmlElements = {
  [Tag in keyof HTMLElements]: React.FunctionComponent<
    Omit<HTMLMotionProps<Tag>, "children"> & {
      children?: React.ReactNode;
      displacementScale?: number;
      blur?: number;
      saturation?: number;
      displacementBlur?: number;
    }
  >;
};

const LiquidGlassV2ImplMemoized = memo(function LiquidGlassV2Impl({
  children,
  className,
  displacementScale = 0.5,
  blur = 8,
  saturation = 1.5,
  displacementBlur = 0.04,
  tag,
  ...props
}: LiquidGlassV2Props & { tag: keyof HTMLElements }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 80 });
  const filterIdRef = useRef(
    `glass-filter-${Math.random().toString(36).substr(2, 9)}`
  );
  const filterId = filterIdRef.current;

  // Monitor element size
  useEffect(() => {
    if (!elementRef.current) return;

    const updateDimensions = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 100),
          height: Math.max(rect.height, 50),
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(elementRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Generate displacement map proportional to element size
  const { width, height } = dimensions;
  const rx = Math.min(width, height) * 0.5; // Radius proportional to size
  const centerInset = Math.min(width, height) * 0.014; // 1.4% inset
  const centerBlur = Math.min(width, height) * 0.055; // 5.5% blur

  const displacementMapSvg = React.useMemo(() => {
    const blockerWidth = width - centerInset * 2;
    const blockerHeight = height - centerInset * 2;

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="red-${filterId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="blue-${filterId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="black"/>
        <rect width="${width}" height="${height}" rx="${rx}" fill="url(#red-${filterId})"/>
        <rect width="${width}" height="${height}" rx="${rx}" fill="url(#blue-${filterId})" style="mix-blend-mode: difference"/>
        <rect x="${centerInset}" y="${centerInset}" width="${blockerWidth}" height="${blockerHeight}" rx="${rx}" fill="hsl(0 0% 50% / 0.93)" style="filter:blur(${centerBlur}px)"/>
      </svg>
    `)}`;
  }, [width, height, rx, centerInset, centerBlur, filterId]);

  const MotionComponent = motion[tag as "div"];

  return (
    <MotionComponent
      ref={elementRef as any}
      {...props}
      className={cn("liquid-glass-v2", className)}
      style={{
        // @ts-ignore
        "--glass-blur": `${blur}px`,
        "--glass-saturation": saturation,
        "--glass-filter-url": `url(#${filterId})`,
        ...props.style,
      }}
    >
      {children}

      {/* Inline SVG filter */}
      <svg
        className="glass-filter-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter
            id={filterId}
            primitiveUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              result="map"
              width="100%"
              height="100%"
              x="0"
              y="0"
              href={displacementMapSvg}
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={displacementBlur}
              result="blur"
            />
            <feDisplacementMap
              in="blur"
              in2="map"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacement"
            />
          </filter>
        </defs>
      </svg>
    </MotionComponent>
  );
});

const componentCache = new Map<string, React.FunctionComponent<any>>();

const LiquidGlassV2 = new Proxy({} as LiquidGlassV2HtmlElements, {
  get(_, property) {
    const tag = property as string;

    if (componentCache.has(tag)) {
      return componentCache.get(tag)!;
    }

    const Component = (props: any) => (
      <LiquidGlassV2ImplMemoized {...props} tag={tag} />
    );

    componentCache.set(tag, Component);
    return Component;
  },
});

export default LiquidGlassV2;
