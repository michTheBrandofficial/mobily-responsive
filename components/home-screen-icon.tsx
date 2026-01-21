import Tools from "@/assets/images/tools icon.png";
import { cn } from "@/lib/cn";
import { motion } from "motion/react";
import React, { MouseEventHandler } from "react";

const HomeScreenIcon: React.FC<{
	icon: {
		name: string;
		icon: string;
	};
	onClick: MouseEventHandler<HTMLDivElement>;
}> = ({ icon: { icon, name }, ...rest }) => {
	const isUntitled = icon === Tools;

	return (
		<motion.div
			whileTap={{ scale: 0.95 }}
			onClick={rest.onClick}
			className={cn(
				"tws-w-[60px] tws-h-fit tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer ",
			)}
		>
			{isUntitled ? (
				<div
					className={cn(
						"tws-size-[50px] tws-rounded-[28px] @[300px]:tws-size-[54px] tws-bg-white tws-flex tws-items-center tws-justify-center ",
					)}
				>
					<img
						src={Tools}
						alt={"Untitled"}
						className="tws-size-[70%] tws-rounded-[inherit] "
					/>
				</div>
			) : (
				// squircle here too
				<img
					src={icon}
					alt={name}
					className="tws-size-[50px] tws-rounded-[28px] tws-overflow-hidden @[300px]:tws-size-[54px] "
				/>
			)}
			<p
				className={`/tws-text-white tws-min-w-[75px] tws-overflow-visible tws-text-center tws-text-[#474844] tws-text-[11px] tws-whitespace-nowrap tws-max-w-full tws-font-SF_Pro_Display tws-font-medium `}
			>
				{name.length > 10 ? name.slice(0, 10).concat("...") : name}
			</p>
		</motion.div>
	);
};

export default HomeScreenIcon;
