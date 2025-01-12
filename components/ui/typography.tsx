
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { twFontFamily } from "./constants";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "tw-scroll-m-20 tw-text-black tw-text-4xl tw-font-extrabold tw-tracking-tight lg:tw-text-5xl",
      h2: "tw-scroll-m-20 tw-text-black tw-text-3xl tw-font-semibold tw-tracking-tight",
      h3: "tw-scroll-m-20 tw-text-black tw-text-2xl tw-font-semibold tw-tracking-tight",
      h4: "tw-scroll-m-20 tw-text-black tw-text-xl tw-font-semibold tw-tracking-tight",
      p: "tw-leading-7 tw-font-medium [&:not(:first-child)]:tw-mt-6",
      span: "tw-font-medium [&:not(:first-child)]:tw-mt-6",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

const Typography = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, variant, ...props }, ref) => {
    const Comp = variant || "p";

    return (
      <Comp
        className={cn(`${twFontFamily} `, typographyVariants({ variant, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };

