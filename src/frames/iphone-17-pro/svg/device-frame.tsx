import { devsize } from "@/components/ui/dev-size";
import { cn } from "@/lib/cn";
import { FC } from "react";

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
		<div
			id="main-container"
			className="tws-w-fit tws-h-full tws-aspect-[655/1363] tws-flex tws-items-center tws-justify-center [container-type:inline-size] "
			style={{
				// @ts-ignore
				// Set based on parent container (which wraps touchable-screen)
				"--base-radius": "calc(98 / 310 * 100cqw)",
			}}
		>
			<div
				className={cn(
					"tws-h-full tws-w-fit tws-rounded-[calc(var(--base-radius)+35px/3)] ",
					`tws-shadow-[0px_0px_1px_0.8px_rgba(231,229,228,0.6),_0px_0px_1px_2px_rgba(0,0,0,0.8)] `,
				)}
			>
				{/* Dark frame */}
				<div
					className={cn(
						"tws-h-full tws-w-fit tws-p-[calc(13px/3)] tws-bg-[#2C2B31] ",
						"tws-rounded-[calc(var(--base-radius)+33px/3)] ",
					)}
				>
					{/* Black Bezel */}
					<div
						className={cn(
							"tws-h-full tws-w-fit tws-p-[calc(20px/3)] tws-bg-[#060100] ",
							"tws-rounded-[calc(var(--base-radius)+20px/3)] ",
						)}
					>
						{/* device touchable screen */}
						<div
							id="touchable-screen"
							className={cn(
								"tws-h-full tws-w-fit tws-aspect-[201/437] tws-max-w-[402px] tws-max-h-[874px] tws-bg-white ",
								"tws-rounded-[calc(var(--base-radius))] ",
							)}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeviceFrame;
