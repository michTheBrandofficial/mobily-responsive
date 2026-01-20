import Tools from "@/assets/images/tools icon.png";
import { cn } from "@/lib/cn";
import { pipe } from "@/lib/pipe";
import { px } from "@/lib/utils";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useIconCoordinates } from "@/src/stores/icon-coordinates";
import { useIframeSrc } from "@/src/stores/iframe-src";
import { useIphoneConfig } from "@/src/stores/iphone-config";
import { useLocalStorage } from "@/src/stores/local-storage";
import { useQuery } from "@tanstack/react-query";
import { readFile, readTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useRef } from "react";
import { dataDir, FSOptions, homeScreenIconScale } from "~/constants";
import HomeScreenIcon from "./home-screen-icon";
import DockIcons, { SearchIcon } from "./icons/dock-icons";

const numberIconsInRow = 4;

const HomeScreen: React.FC = () => {
	const { setSrc } = useIframeSrc();
	const { deviceScreen, setDeviceScreen } = useDeviceScreen();
	const homeScreenIconRef = useRef<HTMLDivElement>(null);
	let isInFirstTwoIcons = true;
	// leave this animation here for reversal;
	let animation = useRef<Animation | null>(null);
	const untitledIcon: App.HomeScreenIconMapping[string] = {
		name: "Untitled",
		origin: "http://localhost:5173",
		icon: Tools,
	};
	const { data: homeScreenIcons = [] } = useQuery({
		queryKey: ["home-screen-icons"],
		queryFn: async () => {
			try {
				const textResponse = await readTextFile(
					`${dataDir}/icons.json`,
					FSOptions,
				);
				const iconFileObject: App.HomeScreenIconMapping =
					JSON.parse(textResponse);
				const iconValues = Object.values(iconFileObject);
				for (const icon of iconValues) {
					const val = await readFile(icon.icon, FSOptions).then(
						(val) => new Blob([val]),
					);
					icon.icon = URL.createObjectURL(val);
				}
				return [...iconValues, untitledIcon] as Array<
					App.HomeScreenIconMapping[string]
				>;
			} catch (error) {
				console.log(error, "error fetching home screen icons");
				return [untitledIcon];
			}
		},
	});
	const { setIconCoordinates } = useIconCoordinates();

	// animation for icons
	useEffect(() => {
		if (deviceScreen === "app-screen") {
			const { x, y } = homeScreenIconRef.current!.getBoundingClientRect();
			setIconCoordinates([x, y, isInFirstTwoIcons as true]);
			animation.current = homeScreenIconRef.current!.animate(
				[
					{
						opacity: 0.3,
					},
					{
						offset: 0.333,
						scale: homeScreenIconScale.toString(),
						translate: `${px(isInFirstTwoIcons ? 30 : -30)} 30px`,
					},
					{
						opacity: 0,
					},
				],
				{
					duration: 1000,
					fill: "forwards",
					easing: "cubic-bezier(0.33, 1, 0.68, 1)",
				},
			);
		} else animation.current?.reverse();
	}, [deviceScreen]);
	const {
		storage: { lastUsedDevice: device },
	} = useLocalStorage();
	const { iphoneConfig } = useIphoneConfig();
	const isIpad = device.includes("ipad");
	const ipadConfigMemo = pipe(device.includes("ipad"), (isIpad) => {
		return {
			dockIconsClass: isIpad
				? " !tws-px-4 !tws-py-5 tws-bg-white/15 !tws-w-fit tws-gap-x-5 "
				: "",
			searchButtonClass: isIpad ? " !tws-bg-white/15 " : "",
			screenIconsClass: isIpad
				? " !tws-max-w-[826px] !tws-grid-cols-6-60  "
				: "",
		};
	});
	return (
		<section
			style={{
				paddingTop: `${90 - parseInt(`${iphoneConfig.safeAreaInset}`)}px`,
			}}
			className="tws-h-full tws-w-full tws-flex tws-flex-col tws-justify-between tws-font-SF_Pro_Display tws-tracking-wide tws-@container "
		>
			<section
				className={cn(
					"tws-h-fit tws-w-full tws-mx-auto tws-px-[24px] tws-font-medium tws-grid tws-gap-y-8 tws-grid-cols-4-60 tws-justify-between ",
					ipadConfigMemo.screenIconsClass,
				)}
			>
				{homeScreenIcons.map((icon, i) => {
					return (
						<HomeScreenIcon
							onClick={({ currentTarget }) => {
								homeScreenIconRef.current = currentTarget!;
								const iconRowIndex = Number(i) % numberIconsInRow;
								isInFirstTwoIcons = [0, 1].includes(iconRowIndex);
								setDeviceScreen("app-screen");
								setSrc(icon.origin);
							}}
							key={i}
							icon={icon}
						/>
					);
				})}
			</section>
			{/* Search buttons and device dock */}
			<section className="tws-w-full tws-px-3 tws-pb-3 tws-flex tws-flex-col tws-items-center tws-gap-y-[10px] ">
				<div
					className={cn(
						"tws-rounded-full tws-w-fit tws-px-[11px] tws-py-[7px] tws-bg-[#666666]/30 tws-backdrop-blur-[10px] tws-text-[#474844] tws-font-normal tws-font-SF_Pro_Display tws-flex tws-items-center tws-gap-x-1 tws-text-xs",
						ipadConfigMemo.searchButtonClass,
					)}
				>
					<SearchIcon className={"tws-fill-[#474844] "} /> Search
				</div>
				{/* Dock */}
				<div
					className={cn(
						"tws-h-fit tws-w-full tws-rounded-[120px] tws-overflow-hidden ",
					)}
					style={{
						// @ts-ignore
						cornerShape: "superellipse(1.5)",
					}}
				>
					<div
						className={cn(
							"tws-bg-[#666666]/30 tws-backdrop-blur-[10px] tws-px-4 tws-py-5 tws-font-medium tws-flex tws-justify-between",
						)}
					>
						<DockIcons isIpad={isIpad} />
					</div>
				</div>
			</section>
		</section>
	);
};

export default HomeScreen;
