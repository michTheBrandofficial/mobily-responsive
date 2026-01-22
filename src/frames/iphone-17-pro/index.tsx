import Wallpaper from "@/assets/images/iphone-17-pro-wallpaper.jpg";
import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { cn } from "@/lib/cn";
import { FC, memo } from "react";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

const Iphone17Pro: FC = () => {
	return (
		<Wrapper className="tws-w-fit tws-h-full tws-flex tws-items-center tws-justify-center ">
			<DeviceFrame>
				<img
					src={Wallpaper}
					alt="iPhone 17 Pro"
					className="tws-absolute tws-top-0 tws-left-0"
				/>
				<div
					className={cn(
						`tws-size-full tws-relative tws-z-10 [container-type:size] `,
					)}
					style={{
						// @ts-ignore
						"--screen-container-width": "100cqi",
						/**
						 * @dev padding to ignore safe area (status bar)
						 * @dev the product of the screen container width and the status bar height / status bar width
						 */
						"--appscreen-padding-height":
							"calc(0.15 * var(--screen-container-width))",
						/**
						 * @dev padding to ignore safe area (status bar) in home screen
						 * @dev the product of the screen container width and the status bar height / status bar width + arbitrary padding value for icons
						 */
						"--homescreen-padding-height":
							"calc(32px + 0.15 * var(--screen-container-width))",
					}}
				>
					<StatusBar className="tws-z-[900] tws-w-full tws-absolute tws-top-0 " />
					<HomeScreen
						topPadding={"tws-pt-[var(--homescreen-padding-height)] "}
					/>
					<AppScreen config="iphone" />
				</div>
			</DeviceFrame>
		</Wrapper>
	);
};

export default memo(Iphone17Pro);
