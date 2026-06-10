import { isFunction, pick, sleep } from "@/lib/utils";
import { cn } from "@/lib/cn";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type PopoverContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<PopoverContextType["open"]>>;
  config: {
    transformOrigin:
      | "center"
      | "top"
      | "bottom"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
  };
  onClose?: VoidFunction;
  onOpen?: VoidFunction;
};

const PopoverContext = createContext<PopoverContextType | null>(null);

const usePopover = () => {
  const popoverContext = useContext(PopoverContext);
  if (!popoverContext) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return popoverContext;
};

type PopoverProps = Pick<Props, "children" | "className"> &
  Pick<PopoverContextType, "onClose" | "onOpen"> & {
    transformOrigin?: PopoverContextType["config"]["transformOrigin"];
  };

const PopoverProvider = ({
  children,
  transformOrigin = "center",
  className,
  ...props
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PopoverContext.Provider
      value={{
        open: isOpen,
        setOpen: setIsOpen,
        config: {
          transformOrigin,
        },
        ...pick(props, "onClose", "onOpen"),
      }}
    >
      <section className={cn(className, "tws-w-fit tws-h-fit tws-relative")}>
        {children}
      </section>
    </PopoverContext.Provider>
  );
};

type Props = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * @dev wraps the children in <div> and adds the popover class
 */
const PopoverTrigger: React.FC<
  Pick<Props, "children" | "className"> &
    HTMLMotionProps<"div"> & {
      triggerRef?: React.Ref<HTMLDivElement>;
    }
> = ({ children, className, triggerRef, ...props }) => {
  const { setOpen, open, onOpen } = usePopover();
  const [shouldHaveHighZIndex, setShouldHaveHighZIndex] = useState(false);
  useEffect(() => {
    if (open === false) setTimeout(() => setShouldHaveHighZIndex(false), 500);
  }, [open]);
  return (
    <motion.div
      {...props}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 0.9 }}
      ref={triggerRef}
      className={cn("tws-w-fit tws-h-fit ", className, {
        "tws-relative tws-z-[100000000]": shouldHaveHighZIndex,
      })}
      onTap={async () => {
        setShouldHaveHighZIndex(true);
        await sleep(50);
        setOpen(true);
        onOpen?.();
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * @dev wraps the children in <div> and adds the popover class
 */
const PopoverClose: React.FC<
  Pick<Props, "children" | "className"> & {
    onClose?: (close: () => void) => void;
  }
> = ({ children, className, onClose }) => {
  const { setOpen } = usePopover();
  return (
    <div
      className={cn("tws-w-fit tws-h-fit ", className)}
      onClick={() => (onClose ? onClose(() => setOpen(false)) : setOpen(false))}
    >
      {children}
    </div>
  );
};

type PopoverContentProps = Omit<Props, "children"> & {
  children?:
    | React.ReactNode
    | ((closePopover: VoidFunction) => React.ReactNode);
};

/**
 * @dev adding classnames right-0, left-0 to change the position of the popover
 */
const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
}) => {
  const { open, setOpen, config, onClose } = usePopover();
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) containerRef.current?.focus();
  }, [open]);
  return (
    <AnimatePresence mode="wait">
      {open ? (
        <>
          <motion.section
            key={"popover-underlay"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.2,
              },
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) (setOpen(false), onClose?.());
            }}
            className="tws-fixed tws-h-screen tws-w-screen tws-bg-transparent !tws-mt-0 tws-top-0 tws-left-0 tws-z-[9999]"
          ></motion.section>
          <motion.section
            ref={containerRef}
            key={"popover"}
            initial={{ scale: 0.5 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.12,
                ease: "easeOut",
              },
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
              transition: {
                duration: 0.15,
                ease: "easeIn",
              },
            }}
            tabIndex={0}
            className={cn(
              className,
              "tws-min-h-[220px] tws-min-w-[220px] tws-top-[120%] tws-rounded-[20px] tws-absolute tws-z-[10000] tws-p-1.5 tws-space-y-2 ",
              "tws-bg-white/60 tws-backdrop-blur-[13px]",
              "tws-shadow-[1px_0px_1px_1px_rgba(231,229,228,0.6),_0px_0px_1px_1px_rgba(0,0,0,.25)] ",
              { "tws-origin-center": config.transformOrigin === "center" },
              { "tws-origin-top": config.transformOrigin === "top" },
              { "tws-origin-bottom": config.transformOrigin === "bottom" },
              {
                "tws-origin-top-right": config.transformOrigin === "top-right",
              },
              { "tws-origin-top-left": config.transformOrigin === "top-left" },
              {
                "tws-origin-bottom-left":
                  config.transformOrigin === "bottom-left",
              },
              {
                "tws-origin-bottom-right":
                  config.transformOrigin === "bottom-right",
              }
            )}
          >
            {isFunction(children)
              ? children(() => (setOpen(false), onClose?.()))
              : children}
          </motion.section>
        </>
      ) : (
        ""
      )}
    </AnimatePresence>
  );
};

/**
 * @example
 * ```jsx
 * <Popover className="" open={open} >
 *  <Popover.Trigger className="p-5 flex justify-between items-center" >
 *    <Button variant='icon' >
 *      <User />
 *    </Button>
 *  </Popover.Trigger>
 *  <Popover.Content className="p-5" >
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
