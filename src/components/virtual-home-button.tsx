import { px } from "@/lib/utils";
import { memo } from "nixix/primitives";
import { useTheme } from "../stores/theme";

type VirtualHomeButtonProps = JSX.IntrinsicElements['div'] & {
  bgColor?: /*dark*/'#000' | /*light*/'#fff'
}

const VirtualHomeButton: Nixix.FC<VirtualHomeButtonProps> = ({className = '', style, ...rest}): someView => {
  const { theme } = useTheme()
  const bgColor = memo(() => {
    return theme.value === 'dark' ? '#000' : '#fff'
  }, [theme])
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