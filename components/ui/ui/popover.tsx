import { cn } from "@/lib/cn";
import { createContext, onlyChild } from "@/lib/context";
import { FC, NixixNode } from "nixix";
import { Show } from "nixix/hoc";
import { callRef, effect, memo, Store, store } from "nixix/primitives";

type TPopoverContextSetters = {
  setOpen: (open: boolean) => void;
};

type TPopoverContext = {
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

const { Provider, context } =
  createContext<Store<TPopoverContext & TPopoverContextSetters>>();

type PopoverProps = {
  children: () => NixixNode;
  transformOrigin?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
};

/**
 * @dev children is a function, till we finish rendering provider, so provider can set state.
 */
const PopoverProvider = ({
  children,
  transformOrigin = "bottom-right",
}: PopoverProps) => {
  const [popoverState, setPopoverState] = store<TPopoverContext>({
    open: false,
    config: {
      transformOrigin: transformOrigin,
    },
  });
  const validatedChildren = onlyChild(children);
  return (
    <Provider
      value={{
        ...popoverState,
        setOpen(open) {
          setPopoverState((p) => {
            p.open = open;
            return p;
          });
        },
      }}
    >
      {() => (
        <section className={cn("tws-w-fit tws-h-fit tws-relative")}>
          {validatedChildren()}
        </section>
      )}
    </Provider>
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
  const { setOpen, open } = context();
  const styleMemo = memo(() => open.value ? {
    zIndex: 100000,
    scale: 1.2
  } : {
    zIndex: 10,
    scale: 1,
  }, [open])
  return (
    <div
      className={cn("tws-w-fit tws-h-fit tws-relative tws-transition-[scale] tws-duration-500 ", className)}
      style={styleMemo}
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
  const { setOpen } = context();
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
  const { open, config, setOpen } = context();
  const containerRef = callRef<HTMLElement>();
  effect(() => {
    if (open.value) containerRef.current?.focus();
  });
  return (
    <Show when={() => open.value === true}>
      <section
        on:click_self={() => setOpen(false)}
        className="tws-fixed tws-h-screen tws-w-screen tws-bg-black/40 tws-backdrop-blur-[128px] !tws-mt-0 tws-top-0 tws-left-0 tws-z-[99999]"
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
