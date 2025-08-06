import { concat } from "nixix/primitives";
import { deviceFrameHeightClass } from "~/constants";
import IpadProi13 from "./device-image.png";

interface Props extends App.SVGProps {
	height: number;
}

const DeviceFrame: Nixix.FC<Props> = ({
	className,
	height,
	...rest
}): someView => {
	return (
		<img
			src={IpadProi13}
			alt="Ipad Image"
			style={{
				...rest.style,
				width: "auto",
				position: "relative",
			}}
			className={concat`${deviceFrameHeightClass} ${className}`}
		/>
	);
};

export default DeviceFrame;

