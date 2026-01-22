import { Activity, FC, SVGAttributes } from "react";
import Messages from "./dock-icons-images/Messages.png";
import Notes from "./dock-icons-images/Notes.png";
import Photos from "./dock-icons-images/Photos.png";
import Safari from "./dock-icons-images/Safari.png";
import Settings from "./dock-icons-images/Settings.png";
import AppStore from "./dock-icons-images/App-Store.png";

export const SearchIcon: FC<SVGAttributes<SVGSVGElement>> = (props) => {
	return (
		<svg
			width="12"
			height="12"
			fill="inherit"
			{...props}
			viewBox="0 0 60 60"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M24.5034 48.5428C29.7928 48.5428 34.7317 46.8385 38.7467 43.9978L53.8502 58.9584C54.5511 59.6527 55.4752 60 56.4312 60C58.5023 60 60 58.4219 60 56.4019C60 55.4549 59.6816 54.5712 58.9801 53.8769L43.9723 38.9794C47.1269 34.8764 49.0068 29.7948 49.0068 24.2715C49.0068 10.9206 37.9818 0 24.5034 0C10.9931 0 0 10.9206 0 24.2715C0 37.6222 10.9931 48.5428 24.5034 48.5428ZM24.5034 43.3035C13.9564 43.3035 5.2894 34.687 5.2894 24.2715C5.2894 13.8559 13.9564 5.23944 24.5034 5.23944C35.0186 5.23944 43.7174 13.8559 43.7174 24.2715C43.7174 34.687 35.0186 43.3035 24.5034 43.3035Z"
				fill="inherit"
			/>
		</svg>
	);
};

/**
 * @note four dock icons of sizes 64x64
 */
const DockIcons = (props: { isIpad: boolean }) => {
	return (
		<>
			{[Messages, Safari, Photos, Settings].map((Icon, i) => (
				<img
					key={i}
					src={Icon}
					className="tws-size-[50px] tws-overflow-hidden @[300px]:tws-size-[54px] "
				/>
			))}
			<Activity mode={props.isIpad ? "visible" : "hidden"}>
				<>
					{[Notes, AppStore].map((Icon, i) => (
						<img
							key={i}
							src={Icon}
							className="tws-size-[50px] tws-overflow-hidden @[300px]:tws-size-[54px] "
						/>
					))}
				</>
			</Activity>
		</>
	);
};

export default DockIcons;
