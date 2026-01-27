import DevIcon from "@/assets/images/developer-icon.jpg";
import { cn } from "@/lib/cn";
import { pipe } from "@/lib/pipe";
import { sleep } from "@/lib/utils";
import { userFacingHotKeysConfig } from "@/src/hot-keys-config";
import { useIphoneConfig } from "@/src/stores/iphone-config";
import { useLocalStorage } from "@/src/stores/local-storage";
import { useTheme } from "@/src/stores/theme";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ChevronRight, CommandIcon } from "lucide-react";
import { FC, Fragment, SVGAttributes, useEffect } from "react";
import Kbd from "./ui/kbd";
import Menu from "./ui/menu";
import Toggle from "./ui/toggle";
import { getVersion } from "@tauri-apps/api/app";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

const ThemeIcon = (props: SVGAttributes<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			{...props}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M7.99997 16C12.3686 16 16 12.3765 16 8C16 3.63138 12.3608 0 7.99214 0C3.61565 0 0 3.63138 0 8C0 12.3765 3.62351 16 7.99997 16ZM7.99997 14.6667C4.29801 14.6667 1.34114 11.702 1.34114 8C1.34114 4.30588 4.29018 1.33334 7.99214 1.33334C11.6862 1.33334 14.6588 4.30588 14.6667 8C14.6745 11.702 11.6941 14.6667 7.99997 14.6667ZM10.2431 9.74116C7.86661 9.74116 6.34507 8.25098 6.34507 5.8745C6.34507 5.38041 6.47839 4.68235 6.61958 4.31374C6.6588 4.21178 6.66663 4.14903 6.66663 4.10981C6.66663 3.99215 6.57253 3.85883 6.40782 3.85883C6.3529 3.85883 6.2588 3.86666 6.15684 3.90588C4.5333 4.54903 3.44311 6.30589 3.44311 8.14901C3.44311 10.7294 5.41173 12.5726 7.99214 12.5726C9.87445 12.5726 11.498 11.4118 12.0627 9.99214C12.1019 9.89018 12.1098 9.78821 12.1098 9.75686C12.1098 9.59215 11.9764 9.48235 11.8509 9.48235C11.8039 9.48235 11.749 9.49018 11.6627 9.51371C11.3333 9.63137 10.7843 9.74116 10.2431 9.74116Z"
				fill="inherit"
			/>
		</svg>
	);
};

export const FullscreenIcon = (props: SVGAttributes<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			stroke="white"
			{...props}
			viewBox="0 0 16 16"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.5 3C3.67157 3 3 3.67157 3 4.5V6.25C3 6.66421 2.66421 7 2.25 7C1.83579 7 1.5 6.66421 1.5 6.25V4.5C1.5 2.84315 2.84315 1.5 4.5 1.5H6.25C6.66421 1.5 7 1.83579 7 2.25C7 2.66421 6.66421 3 6.25 3H4.5ZM9 2.25C9 1.83579 9.33579 1.5 9.75 1.5H11.5C13.1569 1.5 14.5 2.84315 14.5 4.5V6.25C14.5 6.66421 14.1642 7 13.75 7C13.3358 7 13 6.66421 13 6.25V4.5C13 3.67157 12.3284 3 11.5 3H9.75C9.33579 3 9 2.66421 9 2.25ZM2.25 9C2.66421 9 3 9.33579 3 9.75V11.5C3 12.3284 3.67157 13 4.5 13H6.25C6.66421 13 7 13.3358 7 13.75C7 14.1642 6.66421 14.5 6.25 14.5H4.5C2.84315 14.5 1.5 13.1569 1.5 11.5V9.75C1.5 9.33579 1.83579 9 2.25 9ZM13.75 9C14.1642 9 14.5 9.33579 14.5 9.75V11.5C14.5 13.1569 13.1569 14.5 11.5 14.5H9.75C9.33579 14.5 9 14.1642 9 13.75C9 13.3358 9.33579 13 9.75 13H11.5C12.3284 13 13 12.3284 13 11.5V9.75C13 9.33579 13.3358 9 13.75 9Z"
				fill="inherit"
			/>
		</svg>
	);
};

interface Props {
	trigger: React.ReactNode;
}

const AppSettingsMenu: FC<Props> = (props) => {
	const { setIphoneConfig, iphoneConfig } = useIphoneConfig();
	const { setStorage, storage } = useLocalStorage();
	const appWindow = getCurrentWindow();
	const { data: version } = useQuery({
		queryKey: ["app-version"],
		queryFn: getVersion,
	});
	useEffect(() => {
		appWindow.setAlwaysOnTop(storage.lastAlwaysOnTop);
	}, []);
	return (
		<Menu transformOrigin="top-right">
			<Menu.Trigger>{props.trigger}</Menu.Trigger>
			<Menu.Content className="tws-min-h-fit tws-min-w-[220px] !tws-bg-white/80  -tws-right-2 tws-top-8 tws-py-2 ">
				<Menu.Item
					whileHover={undefined}
					whileTap={undefined}
					onTap={undefined}
					noBgColorStates
					className="tws-cursor-auto font"
				>
					Always on top
					<Toggle
						checked={storage.lastAlwaysOnTop}
						onChange={async (checked) => {
							setStorage("lastAlwaysOnTop", checked);
							appWindow.setAlwaysOnTop(checked);
						}}
					/>
				</Menu.Item>
				<Menu.Item
					whileHover={undefined}
					whileTap={undefined}
					onTap={undefined}
					noBgColorStates
					className="tws-cursor-auto"
				>
					<span className="tws-opacity-50 tws-cursor-not-allowed">
						Show bezels
					</span>
					<Toggle
						disabled
						checked={storage.lastHasBezels}
						onChange={(checked) => {
							setStorage("lastHasBezels", checked);
							setIphoneConfig({
								...iphoneConfig,
								hasBezels: checked,
							});
						}}
					/>
				</Menu.Item>
				<Menu.Item
					whileHover={undefined}
					whileTap={undefined}
					onTap={undefined}
					noBgColorStates
					className="tws-cursor-auto"
				>
					<div className="tws-flex tws-items-center tws-gap-x-2 tws-text-sm">
						<ThemeIcon
							fill="#020003"
							stroke={""}
							strokeWidth={6}
							width={16}
							height={16}
						/>
						Theme
					</div>
					<ThemeTab />
				</Menu.Item>
				<HotKeysMenu />
				<Menu transformOrigin="top-right" className="tws-w-full">
					<Menu.Trigger noHover className="tws-w-full">
						<Menu.Item onTap={undefined} className="tws-text-sky-700">
							About
							<ChevronRight size={14} />
						</Menu.Item>
					</Menu.Trigger>
					<Menu.Content className="tws-min-h-fit tws-max-h-48 tws-bg-white/80 tws-right-3 tws-top-8 tws-rounded-[18px] tws-py-2 ">
						<Menu.Item
							onTap={async (close) => {
								close();
								await sleep(400);
								window.open("https://x.com/mich_thedev", "_blank");
							}}
						>
							About Developer
							<img
								className="tws-ml-auto tws-size-6 tws-rounded-full"
								src={DevIcon}
							/>
						</Menu.Item>
						<div className="w-full tws-px-3">
							<div className="tws-h-[1px] tws-w-full tws-bg-zinc-400" />
						</div>
						<Menu.Item
							noBgColorStates
							whileHover={undefined}
							whileTap={undefined}
							onTap={undefined}
						>
							<span className=" tws-text-blue-400">Version</span>
							<span>v{version}</span>
						</Menu.Item>
					</Menu.Content>
				</Menu>
			</Menu.Content>
		</Menu>
	);
};

/**
 * @dev this controls it's own state.
 */
const ThemeTab = () => {
	const { theme, setTheme } = useTheme();
	/**
	 * setTheme(option.value as "light");
		await sleep(300);
		close();
	 */
	return (
		<motion.div
			onTap={() => {
				setTheme(theme === "light" ? "dark" : "light");
			}}
			className={cn(
				"tws-w-fit tws-h-fit tws-bg-[#bbbbbd] tws-font-normal tws-rounded-full ",
				"tws-grid tws-grid-cols-2 tws-relative ",
				"after:tws-absolute after:tws-z-10 after:tws-h-full after:tws-w-1/2 after:tws-bg-white after:tws-rounded-full after:tws-transition-all after:tws-duration-[200] after:tws-ease-in-out",
				{ "after:tws-translate-x-full": theme === "dark" },
			)}
		>
			<div className="tws-text-white tws-relative tws-z-20 tws-px-2.5 tws-py-1.5 tws-text-xs tws-mix-blend-difference">
				Light
			</div>
			<div className="tws-text-white tws-relative tws-z-20 tws-px-2.5 tws-py-1.5 tws-text-xs tws-mix-blend-difference">
				Dark
			</div>
		</motion.div>
	);
};

const HotKeysMenu = () => {
	return (
		<Menu transformOrigin="top-right" className="tws-w-full">
			<Menu.Trigger noHover className="tws-w-full">
				<Menu.Item onTap={undefined}>
					<div className="tws-flex tws-items-center tws-gap-x-2">
						<CommandIcon size={16} />
						Hot keys
					</div>
					<ChevronRight size={14} />
				</Menu.Item>
			</Menu.Trigger>
			<Menu.Content className="tws-min-h-fit tws-max-h-48 !tws-bg-white/[0.98] tws-overflow-y-auto tws-thin-scrollbar tws-right-3 tws-top-8 ">
				{pipe(Object.values(userFacingHotKeysConfig), (allUserHotKeys) =>
					allUserHotKeys.map((hotKey, index) => {
						return (
							<Fragment key={hotKey.raw.concat(index.toString())}>
								<Menu.Item
									noBgColorStates
									whileHover={undefined}
									whileTap={undefined}
									onTap={undefined}
									className="tws-mb-1.5 last:tws-mb-0 tws-min-w-full !tws-cursor-auto"
								>
									{hotKey.label}
									{hotKey.keys.length === 1 ? (
										<Kbd className="!tws-text-sm !tws-p-1 !tws-leading-none">
											{hotKey.keys[0]}
										</Kbd>
									) : (
										<Kbd.Group>
											{hotKey.keys.map((key, index) => (
												<Fragment key={index}>
													<Kbd className="!tws-text-sm !tws-p-1 !tws-leading-none">
														{key}
													</Kbd>
													{!(index + 1 === hotKey.keys.length) && (
														<span>+</span>
													)}
												</Fragment>
											))}
										</Kbd.Group>
									)}
								</Menu.Item>
							</Fragment>
						);
					}),
				)}
			</Menu.Content>
		</Menu>
	);
};

export default AppSettingsMenu;
