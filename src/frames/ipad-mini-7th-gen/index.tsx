import Wallpaper from "@/assets/images/iphone-15-wallpaper.jpg";
import AppScreen from "@/components/app-screen";
import HomeScreen from "@/components/home-screen";
import Wrapper from "@/components/wrapper";
import { cn } from "@/lib/cn";
import { FC, memo } from "react";
import DeviceFrame from "./svg/device-frame";
import StatusBar from "./svg/status-bar";

const IpadMini7thGen: FC = () => {
	return (
		<Wrapper className="tws-w-fit tws-h-full tws-flex tws-items-center tws-justify-center ">
			<DeviceFrame>
				<img
					src={Wallpaper}
					alt="iPad Mini 7th Gen"
					className="tws-absolute tws-top-0 tws-left-0"
				/>
				<div
					className={cn(
						`tws-size-full tws-relative tws-z-10 [container-type:size] `,
					)}
					style={{
						// @ts-ignore
						"--screen-container-width": "100cqi",
					}}
				>
					<StatusBar className="tws-z-[900] tws-w-full tws-absolute tws-top-0 " />
					<HomeScreen topPadding="tws-pt-[calc(32px_+_0.15_*_var(--screen-container-width))] " />
					<AppScreen config="iphone" />
				</div>
			</DeviceFrame>
		</Wrapper>
	);
};

export default memo(IpadMini7thGen);
