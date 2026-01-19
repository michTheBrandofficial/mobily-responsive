import { cn } from "@/lib/cn";
import { HTMLMotionProps } from "motion/react";
import React, { RefAttributes } from "react";

interface Props
	extends HTMLMotionProps<"section">, RefAttributes<HTMLElement> {}

const Wrapper: React.FC<Props> = ({ className, children, ...rest }) => {
	return (
		<section
			{...rest}
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				transition: {
					delay: 0.3,
				},
			}}
			className={cn(
				"tws-flex tws-relative tws-items-center tws-justify-center ",
				className,
			)}
		>
			{/*@ts-ignore*/}
			{children}
		</section>
	);
};

export default Wrapper;
