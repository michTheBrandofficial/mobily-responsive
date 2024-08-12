import { percentage, px } from "@/lib/utils";
import { VStack } from "nixix/view-components";

/**
 * Maybe the only StatusBar component that returns something other than an `<svg>` and to be put directly into a Container element component.
 */
const StatusBar: Nixix.FC<App.SVGProps> = ({ className, style, ...rest }): someView => {
  return (
    <VStack className={className || ''} style={{
      ...style,
      width: percentage(100),
      height: 'fit-content',
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      paddingTop: px(10),
    }} >
      <svg {...rest} className={'tws-h-fit tws-pb-4'} width="24" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3022 23.3997C18.5529 23.3997 23.62 18.3329 23.62 12.0826C23.62 5.83243 18.5529 0.765625 12.3022 0.765625C6.05154 0.765625 0.984375 5.83243 0.984375 12.0826C0.984375 18.3329 6.05154 23.3997 12.3022 23.3997Z" fill="#262C2D" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3022 19.1558C16.2088 19.1558 19.3758 15.989 19.3758 12.0827C19.3758 8.17627 16.2088 5.00952 12.3022 5.00952C8.39549 5.00952 5.22852 8.17627 5.22852 12.0827C5.22852 15.989 8.39549 19.1558 12.3022 19.1558Z" fill="#121515" />
      <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M12.3024 10.6681C13.0838 10.6681 13.7172 10.0348 13.7172 9.25349C13.7172 8.47222 13.0838 7.83887 12.3024 7.83887C11.5211 7.83887 10.8877 8.47222 10.8877 9.25349C10.8877 10.0348 11.5211 10.6681 12.3024 10.6681Z" fill="#636F73" />
    </svg>
    </VStack>
  )
};

export default StatusBar;