import { cn } from "@/lib/cn";
import { VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

const typographyVariants = cva("", {
	variants: {
		variant: {
			h1: "tws-scroll-m-20 tws-text-paragraph tws-font-Inter tws-text-4xl tws-font-extrabold tws-tracking-tight lg:tws-text-5xl",
			h2: "tws-scroll-m-20 tws-text-paragraph tws-font-Inter tws-text-3xl tws-font-semibold tws-tracking-tight",
			h3: "tws-scroll-m-20 tws-text-paragraph tws-font-Inter tws-text-2xl tws-font-semibold tws-tracking-tight",
			h4: "tws-scroll-m-20 tws-text-paragraph tws-font-Inter tws-text-xl tws-font-semibold tws-tracking-tight",
			h5: "tws-scroll-m-20 tws-text-paragraph tws-font-Inter tws-text-lg tws-font-semibold tws-tracking-tight",
			p: "tws-leading-7 tws-font-medium tws-font-Inter",
			pre: "tws-leading-7 tws-font-medium tws-font-Inter",
			span: "tws-font-medium tws-font-Inter",
		},
	},
	defaultVariants: {
		variant: "p",
	},
});

interface TypographyProps
	extends
		React.HTMLAttributes<HTMLHeadingElement | HTMLPreElement>,
		VariantProps<typeof typographyVariants> {
	asChild?: boolean;
}

const TypographyImpl = forwardRef<HTMLHeadingElement, TypographyProps>(
	({ className, variant, ...props }, ref) => {
		const Comp = variant || "p";

		return (
			<Comp
				className={cn(` `, typographyVariants({ variant, className }))}
				ref={ref as any}
				{...props}
			/>
		);
	},
);

TypographyImpl.displayName = "TypographyImpl";

// Omit the 'variant' prop from TypographyProps
type TypographyWithoutVariant = Omit<TypographyProps, "variant">;

const Typography = Object.assign(TypographyImpl, {
	h1: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>((props, ref) => (
		<TypographyImpl variant="h1" ref={ref} {...props} />
	)),
	h2: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>((props, ref) => (
		<TypographyImpl variant="h2" ref={ref} {...props} />
	)),
	h3: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>((props, ref) => (
		<TypographyImpl variant="h3" ref={ref} {...props} />
	)),
	h4: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>((props, ref) => (
		<TypographyImpl variant="h4" ref={ref} {...props} />
	)),
	h5: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>((props, ref) => (
		<TypographyImpl variant="h5" ref={ref} {...props} />
	)),
	p: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>((props, ref) => (
		<TypographyImpl variant="p" ref={ref} {...props} />
	)),
	pre: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>(
		(props, ref) => <TypographyImpl variant="pre" ref={ref} {...props} />,
	),
	span: forwardRef<HTMLHeadingElement, TypographyWithoutVariant>(
		(props, ref) => <TypographyImpl variant="span" ref={ref} {...props} />,
	),
});

export { Typography, typographyVariants };
