import { px } from "@/lib/utils";

const VirtualHomeButton: Nixix.FC<JSX.IntrinsicElements['div']> = ({className = '', style, ...rest}): someView => {
  return (
    <div className={className} {...rest} style={{
      height: px(4),
      backgroundColor: 'black',
      borderRadius: px(50),
      ...style
    }} />
  )
}

export default VirtualHomeButton;