import { pick, sleep } from "@/lib/utils";
import { cn } from "@/lib/cn";
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
} from "motion/react";
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
  onOpen?: VoidFunction
};

const PopoverContext = createContext<PopoverContextType | null>(null);

const usePopover = () => {
  const popoverContent = useContext(PopoverContext);
  if (!popoverContent) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return popoverContent;
};

type PopoverProps = Pick<Props, "children"> & Pick<PopoverContextType, 'onClose' | 'onOpen'> & {
  transformOrigin?:
  PopoverContextType['config']['transformOrigin'];
};

const PopoverProvider = ({
  children,
  transformOrigin = "center",
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
        ...pick(props, 'onClose', 'onOpen')
      }}
    >
      <section className={cn("w-fit h-fit relative")}>{children}</section>
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
      whileTap={{ scale: 0.95 }}
      {...props}
      ref={triggerRef}
      className={cn("w-fit h-fit ", className, {
        "relative z-[100000000]": shouldHaveHighZIndex,
      })}
      onTap={async () => {
        setShouldHaveHighZIndex(true);
        await sleep(50)
        setOpen(true);
        onOpen?.()
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
      className={cn("w-fit h-fit ", className)}
      onClick={() => (onClose ? onClose(() => setOpen(false)) : setOpen(false))}
    >
      {children}
    </div>
  );
};

/**
 * @dev adding classnames right-0, left-0 to change the position of the popover
 */
const PopoverContent: React.FC<Props> = ({ children, className }) => {
  const { open, setOpen, config, onClose } = usePopover();
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) containerRef.current?.focus();
  }, [open]);
  return (
    <AnimatePresence mode="wait" >
      {open ? (
        <>
          <motion.section
            key={'popover-underlay'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.2
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) (setOpen(false), onClose?.());
            }}
            className="fixed h-screen w-screen bg-white/25 backdrop-blur-[2px] !mt-0 top-0 left-0 z-[10000000]"
          ></motion.section>
          <motion.section
            ref={containerRef}
            key={'popover'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: 'keyframes',
                duration: 0.2
              }
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: {
                duration: 0.25,
                ease: "easeInOut"
              }
            }}
            tabIndex={0}
            className={cn(
              `min-h-[400px] min-w-[300px] top-[120%] bg-white rounded-3xl absolute z-[100000000] border border-gray-100`,
              className,
              { "origin-center": config.transformOrigin === "center" },
              { "origin-top": config.transformOrigin === "top" },
              { "origin-bottom": config.transformOrigin === "bottom" },
              { "origin-top-right": config.transformOrigin === "top-right" },
              { "origin-top-left": config.transformOrigin === "top-left" },
              {
                "origin-bottom-left": config.transformOrigin === "bottom-left",
              },
              {
                "origin-bottom-right":
                  config.transformOrigin === "bottom-right",
              }
            )}
          >
            {children}
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
