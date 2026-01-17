import { cn } from "@/lib/cn";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useLocalStorage } from "@/src/stores/local-storage";
import { CheckIcon } from "lucide-react";
import { FC, useState } from "react";
import Menu from "./ui/menu";

interface Props {
	trigger: React.ReactNode;
}

const DeviceSelectMenu: FC<Props> = (props) => {
	const [deviceList] = useState(
		Object.entries(DEVICE_MAPPING).map(
			([value, { displayName, dimensions }]) => ({
				label: displayName,
				value: value as keyof typeof DEVICE_MAPPING,
				dimensions: dimensions,
			}),
		),
	);
	const {
		storage: { lastUsedDevice: selectedDevice },
		setStorage,
	} = useLocalStorage();
	const setSelectedDevice = (device: any) => {
		setStorage("lastUsedDevice", device);
	};
	return (
		<Menu transformOrigin="top-right">
			<Menu.Trigger>{props.trigger}</Menu.Trigger>
			<Menu.Content className="tws-min-h-fit tws-max-h-48 tws-bg-white/80 -tws-right-2 tws-top-8 ">
				{deviceList.map((device, index) => {
					return (
						<Menu.Item
							isActive={device.value === selectedDevice}
							className="tws-pr-2.5"
							key={`${device.value}-${index}`}
							onTap={async (close) => {
								setSelectedDevice(device.value);
								close();
							}}
						>
							<div className="tws-flex tws-gap-x-2 tws-items-center">
								<CheckIcon
									size={16}
									className={cn("tws-mt-1 ", {
										"tws-hidden": !(device.value === selectedDevice),
									})}
								/>
								{device.label}
							</div>
							<span className="tws-text-xs tws-px-2 tws-py-1 tws-rounded-full tws-bg-sky-50/50 tws-text-sky-500 tws-font-normal ">
								{device.dimensions.width}x{device.dimensions.height}
							</span>
						</Menu.Item>
					);
				})}
			</Menu.Content>
		</Menu>
	);
};

export default DeviceSelectMenu;
