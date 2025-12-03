import { useDeviceFrameHeight } from "~/constants";
import IpadProi13Image from "./device-image.png";
import { FC } from "react";
import { cn } from "@/lib/cn";

interface Props extends App.SVGProps {
  height: number;
}

const DeviceFrame: FC<Props> = ({ className, height, ...rest }) => {
  const { deviceFrameHeightClass } = useDeviceFrameHeight()
  return (
    <img
      src={IpadProi13Image}
      alt={`Ipad Pro 13" Image`}
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
