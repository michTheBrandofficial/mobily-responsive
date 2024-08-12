import { px } from "@/lib/utils";

type VirtualHomeButtonProps = JSX.IntrinsicElements['div'] & {
  bgColor?: /*dark*/'#030712' | /*light*/'#f3f4f6'
}

const VirtualHomeButton: Nixix.FC<VirtualHomeButtonProps> = ({className = '', bgColor = '#f3f4f6', style, ...rest}): someView => {
  return (
    <div className={className} {...rest} style={{
      height: px(4),
      borderRadius: px(50),
      ...style,
      // this is down because we have only two states: dark mode and light mode
      backgroundColor: bgColor,
    }} />
  )
}

export default VirtualHomeButton;