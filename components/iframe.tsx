import { cn } from "@/lib/cn";
import { percentage } from "@/lib/utils";
import { Show } from "nixix/hoc";
import { signal } from "nixix/primitives";
import Loaders from "./loaders";

interface Props extends Nixix.IframeHTMLAttributes<HTMLIFrameElement> { };

/**
 * The height and width of this iframe is 100%;
 * It also has tws-no-scroll on it
 */
const Iframe: Nixix.FC<Props> = ({ style = {}, className, ...props }): someView => {
  const [loading] = signal<boolean>(true);
  return (
    <>
      <Show when={() => loading.value}>
        <Loaders.IOSSpinner />
      </Show>
      <iframe {...props} on:load={() => (loading.value = false)} className={cn('tws-no-scroll  ', className)} style={{
        ...style,
        width: percentage(100),
        height: percentage(100),
      }} />
    </>
  )
}

export default Iframe;