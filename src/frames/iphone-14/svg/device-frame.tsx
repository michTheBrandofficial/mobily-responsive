import { concat } from "nixix/primitives";
import { deviceFrameHeightClass } from "~/constants";
import Iphone15Image from './device-image.png';
interface Props extends App.SVGProps {
  height: number
}

const DeviceFrame: Nixix.FC<Props> = ({ className, height, ...rest }): someView => {

  return (
    <img src={Iphone15Image}
      alt="Iphone Image"
      style={{
        ...rest.style,
        width: 'auto',
        position: 'relative'
      }}
      className={concat`${deviceFrameHeightClass} ${className}`} />
  )
}

export default DeviceFrame;