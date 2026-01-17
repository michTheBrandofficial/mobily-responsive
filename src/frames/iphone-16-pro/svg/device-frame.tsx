import { useDeviceFrameHeight } from "~/constants";
import Iphone16ProImage from "./device-image.png";
import { FC } from "react";
import { cn } from "@/lib/cn";

interface Props extends App.SVGProps {
  height: number;
}

const DeviceFrame: FC<Props> = ({ className, height, ...rest }) => {
  const { deviceFrameHeightClass } = useDeviceFrameHeight()
  return (
    <img
      src={Iphone16ProImage}
      alt="Iphone 16 Pro Image"
      style={{
        ...rest.style,
        width: "auto",
        position: "relative",
      }}
      className={cn(``, deviceFrameHeightClass, className)}
    />
  );
};

export default DeviceFrame;
