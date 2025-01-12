import { cn } from "@/lib/cn";
import { FC, NixixNode } from "nixix";
import { Show } from "nixix/hoc";
import { callRef, effect, store } from "nixix/primitives";

const [popoverState, setPopoverState] = store<PopoverStateType>({
  open: false,
  config: {
    transformOrigin: "bottom-right",
  },
});

type PopoverStateType = {
  open: boolean;
  config: {
    transformOrigin:
      | "center"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
  };
};

type PopoverProps = Pick<Props, "children"> & {
  transformOrigin?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
};

const PopoverProvider = ({
  children,
  transformOrigin = "center",
}: PopoverProps) => {
  return (
    <section className={cn("tws-w-fit tws-h-fit tws-relative")}>
      {children}
    </section>
  );
};

type Props = {
  children?: NixixNode;
  className?: string;
};

/**
 * @dev wraps the children in <div> and adds the popover class
 */
const PopoverTrigger: FC<Pick<Props, "children" | "className">> = ({
  children,
  className,
}) => {
  const setOpen = (bool: boolean) => {
    setPopoverState((p) => ({ ...p, open: bool }));
  };
  return (
    <div
      className={cn("tws-w-fit tws-h-fit ", className)}
      on:click={() => setOpen(true)}
    >
      {children}
    </div>
  );
};

/**
 * @dev wraps the children in <div> and adds the popover class
 */
const PopoverClose: FC<
  Pick<Props, "children" | "className"> & {
    onClose?: (close: () => void) => void;
  }
> = ({ children, className, onClose }) => {
  const setOpen = (bool: boolean) => {
    setPopoverState((p) => ({ ...p, open: bool }));
  };
  return (
    <div
      className={cn("tws-w-fit tws-h-fit ", className)}
      on:click={() =>
        onClose ? onClose(() => setOpen(false)) : setOpen(false)
      }
    >
      {children}
    </div>
  );
};

/**
 * @dev adding classnames tws-right-0, tws-left-0 to change the position of the popover
 */
const PopoverContent: FC<Props> = ({ children, className }) => {
  const { open, config } = popoverState;
  const setOpen = (open: boolean) => setPopoverState((p) => ({ ...p, open }));
  const containerRef = callRef<HTMLElement>();
  effect(() => {
    if (open.value) containerRef.current?.focus();
  });
  return (
    <Show when={() => open.value === true}>
      <section
        on:click_self={() => setOpen(false)}
        className="tws-fixed tws-h-screen tws-w-screen !tws-mt-0 tws-top-0 tws-left-0 tws-z-[99999]"
      ></section>
      <section
        bind:ref={containerRef}
        data-open={open}
        tabindex={0}
        className={`tws-transition-transform tws-duration-500 tws-scale-50 data-[open=true]:tws-scale-100 ${cn(
          ` tws-bg-white tws-absolute tws-z-[100000] `,
          className,
          { "tws-origin-center": config.transformOrigin.value === "center" },
          {
            "tws-origin-top-right":
              config.transformOrigin.value === "top-right",
          },
          {
            "tws-origin-top-left": config.transformOrigin.value === "top-left",
          },
          {
            "tws-origin-bottom-left":
              config.transformOrigin.value === "bottom-left",
          },
          {
            "tws-origin-bottom-right":
              config.transformOrigin.value === "bottom-right",
          }
        )} `}
      >
        {children}
      </section>
    </Show>
  );
};

/**
 * @example
 * ```jsx
 * <Popover className="" open={open} >
 *  <Popover.Trigger className="tws-p-5 tws-flex tws-justify-between tws-items-center" >
 *    <Button variant='icon' >
 *      <User />
 *    </Button>
 *  </Popover.Trigger>
 *  <Popover.Content className="tws-p-5" >
 *    ...children
 *  </Popover.Content>
 * </Popover>
 * ```
 */
const Popover = Object.assign(PopoverProvider, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});

export default Popover;
