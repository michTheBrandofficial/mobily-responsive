import { cn } from "@/lib/cn";
import { HTMLMotionProps, motion } from "motion/react";
import React, { PropsWithChildren } from "react";
import LiquidGlass, { HexColor, RgbColor } from "./liquid-glass";

type Variants = "full" | "icon" | "ghost" | "dormant";

interface ButtonProps extends PropsWithChildren<HTMLMotionProps<"button">> {
  variant?: Variants;
  loading?: boolean;
}

/**
 * @animated with motion.button
 * @dev most buttons will icon buttons
 */
const ButtonImpl: React.FC<ButtonProps> = ({
  children,
  variant = "full",
  className,
  onTap,
  loading,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: props.disabled ? 1 : 0.9 }}
      whileHover={{ scale: props.disabled ? 1 : 1.05 }}
      {...props}
      onTap={
        onTap
          ? (e, info) => {
              if (props.disabled) return;
              else onTap(e, info);
            }
          : undefined
      }
      className={cn(
        `tws-font-semibold tws-rounded-xl  `,
        {
          "tws-bg-sky-500 tws-text-white": variant === "full",
          "tws-text-primary-500": variant === "ghost",
          "tws-text-paragraph tws-bg-stone-200 ": variant === "dormant",
          "tws-px-4 tws-py-2 tws-text-sm": variant !== "icon",
          "tws-bg-primary-500 tws-text-white tws-px-2 tws-py-2":
            variant === "icon",
          "tws-cursor-not-allowed tws-opacity-50": props.disabled,
          "tws-flex tws-items-center tws-gap-x-3 tws-justify-center ": loading,
        },
        className
      )}
    >
      {children}
    </motion.button>
  );
};

interface LiquidGlassButtonProps
  extends
    Pick<ButtonProps, "loading" | "variant">,
    React.ComponentPropsWithRef<typeof LiquidGlass.button> {
  color?: HexColor | RgbColor;
  /**
   * @dev mixing percentage meaning the percentage of {@link LiquidGlassProps.color} contributed to the glass. Expressed in whole numbers from 0 to 100.
   * @default 12
   */
  mixingPercentage?: number;
}

/**
 * @animated with motion.button
 * @dev official liquid glass button
 * @dev most buttons will icon buttons
 */
export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  variant = "full",
  className,
  onTap,
  loading,
  ...props
}) => {
  return (
    <LiquidGlass.button
      whileTap={{ scale: props.disabled ? 1 : 0.9 }}
      whileHover={{ scale: props.disabled ? 1 : 1.05 }}
      {...props}
      onTap={
        onTap
          ? (e, info) => {
              if (props.disabled) return;
              else onTap(e, info);
            }
          : undefined
      }
      className={cn(
        `tws-font-semibold tws-rounded-xl tws-cursor-pointer `,
        {
          "tws-bg-sky-500 tws-text-white": variant === "full",
          "tws-px-4 tws-py-3 tws-text-sm": variant !== "icon",
          "tws-px-2 tws-py-2": variant === "icon",
          "tws-cursor-not-allowed tws-opacity-50": props.disabled,
          "tws-flex tws-items-center tws-gap-x-3 tws-justify-center ": loading,
        },
        className
      )}
    >
      {children}
    </LiquidGlass.button>
  );
};

export const Button = Object.assign(ButtonImpl, {
  LiquidGlass: LiquidGlassButton,
});
