import * as Nixix from "nixix"
import { cn } from "@/lib/cn"
import { Button as VButton } from 'nixix/view-components'

type Variants = 'full' | 'outline' | 'icon' | 'ghost'

type ButtonProps = Nixix.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variants
}

/**
 * @dev this is not animated with scale because of render issue from Webview2 on Windows.
 */
export const Button: Nixix.FC<ButtonProps> = ({ children, variant = 'full', className, ...props }) => {
  return (
    <VButton
      {...props}
      className={cn(
        `active:tws-scale-90 active:tws-rotate-2 hover:tws-scale-105 tws-transition-transform tws-duration-150 `,
        className,
      )}
    >{children}</VButton>
  )
}