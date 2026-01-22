import YourApp from "@/components/icons/dock-icons-images/Your App.png";
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
	const isUntitled = icon === YourApp;

	return (
		<motion.div
			whileTap={{ scale: 0.95 }}
			onClick={rest.onClick}
			className={cn(
				"tws-w-[50px] @[300px]:tws-w-[54px] tws-h-fit tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer ",
			)}
		>
			{isUntitled ? (
				<img
					src={YourApp}
					className="tws-size-[50px] tws-overflow-hidden @[300px]:tws-size-[54px] "
				/>
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
