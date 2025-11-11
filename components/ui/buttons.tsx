import { cn } from "@/lib/cn";
import { HTMLMotionProps, motion } from "motion/react";
import React, { PropsWithChildren } from "react";

type Variants = "full" | "outline" | "icon" | "ghost" | "dormant";

type ButtonProps = PropsWithChildren<HTMLMotionProps<"button">> & {
  variant?: Variants;
  loading?: boolean;
};

/**
 * @animated with motion.button
 */
export const Button: React.FC<ButtonProps> = ({
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
        { "tws-bg-primary-500 tws-text-white": variant === "full" },
        {
          "tws-border-2 tws-border-primary-500 tws-text-primary-400 ":
            variant === "outline",
        },
        { "tws-text-primary-500": variant === "ghost" },
        { "tws-text-paragraph tws-bg-stone-200 ": variant === "dormant" },
        { "tws-px-4 tws-py-2 tws-text-sm": variant !== "icon" },
        { "tws-bg-primary-500 tws-text-white tws-px-2 tws-py-2": variant === "icon" },
        { "tws-cursor-not-allowed tws-opacity-50": props.disabled },
        { "tws-flex tws-items-center tws-gap-x-3 tws-justify-center ": loading },
        className,
      )}
    >
      {children}
    </motion.button>
  );
};
