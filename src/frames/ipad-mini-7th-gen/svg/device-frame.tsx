import { cn } from "@/lib/cn";
import { FC } from "react";

interface Props extends App.SVGProps {
	children?: React.ReactNode;
}

const controlsShadows = {
	/**
	 * @dev there may be no silence controls for ipads
	 */
	controlSilence: `tws-shadow-[-1px_0px_1px_0.3px_rgba(231,229,228,0.6),_-1px_0px_1px_1.5px_rgba(0,0,0,0.8)] `,
	controlSideButton: function get() {
		return this.controlSilence;
	},
	controlVolumeUp: function get() {
		return this.controlSilence;
	},
	controlVolumeDown: function get() {
		return this.controlVolumeUp();
	},
	// reverse x position of first shadow in controlSilence
};

// scale of things from design is 3 so we divide by 3
/**
 * @dev just so you know, we are not choosing arbitrary values for the top position of the control volume up element.
 */
const Controls: FC<Props> = () => {
	return (
		<>
			{/* control side button */}
			<div
				className={cn(
					"tws-w-[1px] tws-rounded-r-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlSideButton(),
					"tws-absolute -tws-left-[2px] @[1000px]/main-container:-tws-left-[4px] ",
					"tws-h-[calc(72_/_646_*_var(--container-height))] tws-top-[calc(60_/_646_*_var(--container-height))]",
				)}
			/>
			{/* control volume up */}
			<div
				className={cn(
					"tws-w-[1px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlVolumeUp(),
					"tws-absolute -tws-left-[2px] @[1000px]/main-container:-tws-left-[4.4px] ",
					"tws-h-[calc(45_/_646_*_var(--container-height))] tws-top-[calc((646-60-90-12)_/_646_*_var(--container-height))]",
				)}
			/>
			{/* control volume down */}
			<div
				className={cn(
					"tws-w-[1px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
					// shadow for depth
					controlsShadows.controlVolumeDown(),
					"tws-absolute -tws-left-[2px] @[1000px]/main-container:-tws-left-[4.4px]",
					"tws-h-[calc(45_/_646_*_var(--container-height))] tws-top-[calc((646-60-45)_/_646_*_var(--container-height))]",
				)}
			/>
		</>
	);
};

const DeviceFrame: FC<Props> = ({ children }) => {
	const noBezels = false;

	return (
		<div
			id="main-container"
			className="tws-w-fit tws-h-full tws-relative tws-aspect-[947/646] tws-flex tws-items-center tws-justify-center [container-type:size] [container-name:main-container] "
			style={{
				// @ts-ignore
				// Set based on parent container (which wraps touchable-screen)
				"--base-radius": "calc(90 / 984 * 100cqi)",
				"--container-height": "100cqb",
			}}
		>
			<div
				className={cn(
					"tws-h-full tws-w-fit tws-rounded-[calc(var(--base-radius)+35px/3)] ",
					`tws-shadow-[0px_0px_1px_0.8px_rgba(231,229,228,0.6),_0px_0px_1px_2px_rgba(0,0,0,0.8)] `,
				)}
				style={{
					// @ts-ignore
					cornerShape: "superellipse(1.85)",
				}}
			>
				{/* Dark frame */}
				<div
					className={cn(
						"tws-h-full tws-w-fit tws-p-[calc(33px/3)] tws-bg-[#060100] ",
						"tws-rounded-[calc(var(--base-radius)+33px/3)] ",
					)}
					style={{
						// @ts-ignore
						cornerShape: "inherit",
					}}
				>
					{/* Black Bezel */}
					<div
						className={cn(
							"tws-h-full tws-w-fit tws-p-[calc(72px/3)] tws-bg-[#060100] ",
							"tws-rounded-[calc(var(--base-radius)+72px/3)] ",
							{
								"tws-invisible": noBezels,
							},
						)}
						style={{
							// @ts-ignore
							cornerShape: "inherit",
						}}
					>
						{/* device touchable screen */}
						<div
							id="touchable-screen"
							className={cn(
								"tws-h-full tws-w-fit tws-aspect-[1133/744] tws-max-w-[1133px] tws-max-h-[744px] tws-bg-black tws-relative tws-overflow-hidden ",
								"tws-rounded-[calc(var(--base-radius)/2.6)] ",
							)}
							style={{
								// @ts-ignore
								cornerShape: "inherit",
							}}
						>
							{children}
						</div>
					</div>
				</div>
			</div>
			<Controls />
		</div>
	);
};

export default DeviceFrame;
