import { devsize } from "@/components/ui/dev-size";
import { cn } from "@/lib/cn";
import { FC } from "react";

interface Props extends App.SVGProps {}

const controlsShadows = {
	controlSilence: `tws-shadow-[-1px_0px_1px_0.3px_rgba(231,229,228,0.6),_-1px_0px_1px_1.5px_rgba(0,0,0,0.8)] `,
	controlVolumeUp: function get() {
		// uses the same shadow because on the same side
		return this.controlSilence;
	},
	controlVolumeDown: function get() {
		// uses the same shadow because on the same side
		return this.controlVolumeUp();
	},
	// reverse x position of first shadow in controlSilence
	controlSideButton: `tws-shadow-[1px_0px_1px_0.3px_rgba(231,229,228,0.6),_1px_0px_1px_1.5px_rgba(0,0,0,0.8)] `,
};

// scale of things from design is 3 so we divide by 3
const Controls: FC<Props> = () => {
	return (
		<>
			{/* control silence */}
			<div
				className={cn(
					"tws-w-[1px] tws-h-[24px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlSilence,
					"tws-absolute -tws-left-[3px] tws-top-[112px] ",
				)}
			/>
			{/* control volume up */}
			<div
				className={cn(
					"tws-w-[1px] tws-h-[45px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlVolumeUp(),
					"tws-absolute -tws-left-[3px] tws-top-[155px] ",
				)}
			/>
			{/* control volume down */}
			<div
				className={cn(
					"tws-w-[1px] tws-h-[45px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlVolumeDown(),
					"tws-absolute -tws-left-[3px] tws-top-[212px] ",
				)}
			/>
			{/* control side button */}
			<devsize.div
				className={cn(
					"tws-w-[1px] tws-h-[72px] tws-rounded-r-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlSideButton,
					"tws-absolute -tws-right-[3px] tws-top-[calc(185px)] ",
				)}
			/>
		</>
	);
};

const DeviceFrame: FC<Props> = () => {
	return (
		<devsize.div
			id="main-container"
			className="tws-w-fit tws-h-full tws-relative tws-aspect-[655/1363] tws-flex tws-items-center tws-justify-center [container-type:inline-size] "
			style={{
				// @ts-ignore
				// Set based on parent container (which wraps touchable-screen)
				"--base-radius": "calc(90 / 310 * 100cqw)",
			}}
		>
			<div
				className={cn(
					"tws-h-full tws-w-fit tws-rounded-[calc(var(--base-radius)+35px/3)] ",
					`tws-shadow-[0px_0px_1px_0.8px_rgba(231,229,228,0.6),_0px_0px_1px_2px_rgba(0,0,0,0.8)] `,
				)}
				style={{
					cornerShape: "superellipse(1.85)",
				}}
			>
				{/* Dark frame */}
				<div
					className={cn(
						"tws-h-full tws-w-fit tws-p-[calc(13px/3)] tws-bg-[#2C2B31] ",
						"tws-rounded-[calc(var(--base-radius)+33px/3)] ",
					)}
					style={{
						cornerShape: "inherit",
					}}
				>
					{/* Black Bezel */}
					<div
						className={cn(
							"tws-h-full tws-w-fit tws-p-[calc(20px/3)] tws-bg-[#060100] ",
							"tws-rounded-[calc(var(--base-radius)+20px/3)] ",
						)}
						style={{
							cornerShape: "inherit",
						}}
					>
						{/* device touchable screen */}
						<div
							id="touchable-screen"
							className={cn(
								"tws-h-full tws-w-fit tws-aspect-[201/437] tws-max-w-[402px] tws-max-h-[874px] tws-bg-white ",
								"tws-rounded-[calc(var(--base-radius))] ",
							)}
							style={{
								cornerShape: "inherit",
							}}
						></div>
					</div>
				</div>
			</div>
			<Controls />
		</devsize.div>
	);
};

export default DeviceFrame;
