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
        `font-semibold rounded-xl  `,
        { "bg-primary-500 text-white": variant === "full" },
        {
          "border-2 border-primary-500 text-primary-400 ":
            variant === "outline",
        },
        { "text-primary-500": variant === "ghost" },
        { "text-paragraph bg-stone-200 ": variant === "dormant" },
        { "px-4 py-2 text-sm": variant !== "icon" },
        { "bg-primary-500 text-white px-2 py-2": variant === "icon" },
        { "cursor-not-allowed opacity-50": props.disabled },
        { "flex items-center gap-x-3 justify-center ": loading },
        className,
      )}
    >
      {children}
    </motion.button>
  );
};
