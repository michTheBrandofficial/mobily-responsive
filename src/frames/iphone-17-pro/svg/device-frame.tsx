import { FC } from "react";
import { cn } from "@/lib/cn";
import { devsize } from "@/components/ui/dev-size";

interface Props extends App.SVGProps {
	height: number;
}

const controlsShadows = {
	// inner shadow with x -4, y 0, blur 5 spread -1 and color black opacity .95
	// another inner shadow with x 0, y -4, blur 5 spread 0 and white opacity 22
	// last shadow inner with x 0, y 4, blur 5, spread 0 and white opacity 22
	controlSilence:
		"tws-shadow-[inset_-4px_0px_5px_-1px_rgba(0,0,0,0.95),inset_0px_-4px_5px_0px_rgba(255,255,255,0.22),inset_0px_4px_5px_0px_rgba(255,255,255,0.22)]",
	controlVolumeUp: function get() {
		// uses the same shadow because on the same side
		return this.controlSilence;
	},
	controlVolumeDown: function get() {
		// uses the same shadow because on the same side
		return this.controlVolumeUp;
	},
	// reverse x position of first shadow in controlSilence
	controlSideButton:
		"tws-shadow-[inset_4px_0px_5px_-1px_rgba(0,0,0,0.95),inset_0px_-4px_5px_0px_rgba(255,255,255,0.22),inset_0px_4px_5px_0px_rgba(255,255,255,0.22)]",
};

// scale of things from design is 3 so we divide by 3
const Controls: FC<Props> = () => {
	return (
		<div className="tws-space-y-1 ">
			{/* control silence */}
			<devsize.div
				className={cn(
					"tws-w-[calc(14px/3)] tws-h-[calc(103px/3)] tws-rounded-l-[calc(6px/3)] tws-bg-[#262427] ",
					// shadow for depth
					controlsShadows.controlSilence,
					"tws-hidden",
				)}
			/>
			{/* control volume up */}
			<devsize.div
				className={cn(
					"tws-w-[calc(14px/3)] tws-h-[calc(184px/3)] tws-rounded-l-[calc(6px/3)] tws-bg-[#262427] ",
					// shadow for depth
					controlsShadows.controlVolumeUp,
					"tws-hidden",
				)}
			/>
			{/* control volume up */}
			<devsize.div
				className={cn(
					"tws-w-[calc(14px/3)] tws-h-[calc(184px/3)] tws-rounded-l-[calc(6px/3)] tws-bg-[#262427] ",
					// shadow for depth
					controlsShadows.controlVolumeDown,
					"tws-hidden",
				)}
			/>
			{/* control side button */}
			<devsize.div
				className={cn(
					"tws-w-[calc(14px/3)] tws-h-[calc(298px/3)] tws-rounded-r-[calc(6px/3)] tws-bg-[#262427] ",
					// shadow for depth
					controlsShadows.controlSideButton,
				)}
			/>
		</div>
	);
};

const DeviceFrame: FC<Props> = () => {
	return (
		<div className="tws-size-full ">
			{/* dark frame */}
			<div
				className={cn(
					"tws-h-full tws-w-fit tws-aspect-[201/437] tws-items-center tws-justify-center tws-flex ",
					"tws-rounded-[calc(240px/3)] ",
					"tws-p-[calc(1.5px)] tws-bg-[#898987]",
					// shadow
					"tws-shadow-[inset_0px_0px_2px_1px_rgba(0,0,0)]",
				)}
			>
				{/* dark frame */}
				<div
					className={cn(
						"tws-h-full tws-w-full tws-items-center tws-justify-center tws-flex ",
						"tws-rounded-[calc(230px/3)] ",
						"tws-border-[calc(15px/3)] tws-border-[#2C2B31]",
					)}
				>
					{/* black bezel */}
					<div
						className={cn(
							"tws-h-full tws-w-full tws-items-center tws-justify-center tws-flex ",
							"tws-rounded-[calc(210px/3)] ",
							"tws-border-[calc(20px/3)] tws-border-[#060100]",
						)}
					>
						{/* device touchable screen */}
						<div
							className={cn(
								"tws-h-full tws-w-fit tws-aspect-[201/437] tws-max-w-[402px] tws-max-h-[874px] tws-bg-white ",
								"tws-rounded-[calc(190px/3)] ",
							)}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeviceFrame;
