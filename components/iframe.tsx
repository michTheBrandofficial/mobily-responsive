import { cn } from "@/lib/cn";
import { percentage } from "@/lib/utils";
import { Show } from "nixix/hoc";
import { Signal, signal } from "nixix/primitives";
import Loaders from "./loaders";

interface Props extends Nixix.IframeHTMLAttributes<HTMLIFrameElement> {
  src: Signal<string>;
}

/**
 * The height and width of this iframe is 100%;
 * It also has tws-no-scroll on it
 */
const Iframe: Nixix.FC<Props> = ({
  style = {},
  className,
  src,
  ...props
}): someView => {
  const [loading] = signal<boolean>(true);

  return (
    <>
      <Show when={() => loading.value}>
        {(open) => (open ? <Loaders.IOSSpinner /> : "")}
      </Show>
      <iframe
        {...props}
        src={src}
        on:load={() => (loading.value = false)}
        className={cn("tws-no-scroll  ", className)}
        allow="clipboard-read; clipboard-write"
        style={{
          ...style,
          width: percentage(100),
          height: percentage(100),
        }}
      />
    </>
  );
};

export default Iframe;
