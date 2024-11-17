import { px } from "@/lib/utils";
import { concat } from "nixix/primitives";
import { deviceFrameHeightClass } from "~/constants";
import Iphone16ProImage from './device-image.png';

interface Props extends App.SVGProps {
  height: number
}

const DeviceFrame: Nixix.FC<Props> = ({ className, height, ...rest }): someView => {

  return (
    <img src={Iphone16ProImage}
      alt="Iphone Image"
      style={{
        ...rest.style,
        width: 'auto',
        maxHeight: px(height),
        position: 'relative'
      }}
      className={concat`${deviceFrameHeightClass} ${className}`} />

  )
}


export default DeviceFrame;