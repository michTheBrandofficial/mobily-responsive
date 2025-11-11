import { omit } from "@/lib/utils";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type MenuContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<MenuContextType["open"]>>;
  config: {
    transformOrigin:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
    noBlur: boolean | undefined
  };
};

const MenuContext = createContext<MenuContextType | null>(null);

const useMenu = () => {
  const menuContext = useContext(MenuContext);
  if (!menuContext) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return menuContext;
};

type MenuProps = Pick<Props, "children"> & {
  transformOrigin?:
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
  noBlur?: boolean;
  className?: string;
};

const MenuProvider = ({
  children,
  transformOrigin = "center",
  ...props
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MenuContext.Provider
      value={{
        open: isOpen,
        setOpen: setIsOpen,
        config: {
          transformOrigin,
          noBlur: props.noBlur
        },
      }}
    >
      <section className={cn(props.className, " w-fit h-fit relative")}>
        {children}
      </section>
    </MenuContext.Provider>
  );
};

type Props = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * @dev wraps the children in <div> and adds the menu class
 */
const MenuTrigger: React.FC<Pick<Props, "children" | "className">> = ({
  children,
  className,
}) => {
  const { setOpen, open } = useMenu();
  const [shouldHaveHighZIndex, setShouldHaveHighZIndex] = useState(false);
  useEffect(() => {
    if (open === false) setTimeout(() => setShouldHaveHighZIndex(false), 500);
  }, [open]);
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={cn("w-fit h-fit p-0 bg-transparent text-inherit ", className, {
        "relative z-[100000000]": shouldHaveHighZIndex,
      })}
      onTap={() => {
        setShouldHaveHighZIndex(true);
        setTimeout(() => {
          setOpen(true);
        }, 50);
      }}
    >
      {children}
    </motion.div>
  );
};

const MenuContent: React.FC<Props> = ({ children, className }) => {
  const { open, setOpen, config } = useMenu();
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) containerRef.current?.focus();
  }, [open]);
  return (
    <AnimatePresence mode="sync" >
      {open ? (
        <>
          <motion.section
            key={'menu-underlay'}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.2
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className={cn("fixed h-screen w-screen bg-transparent !mt-0 top-0 left-0 z-[10000000]", {
              'bg-white/25 backdrop-blur-[2px]': !config.noBlur
            })}
          ></motion.section>
          <motion.section
            ref={containerRef}
            key={'menu'}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{
              scale: 0.5, opacity: 0,
              transition: {
                duration: 0.2
              }
            }}
            tabIndex={0}
            className={cn(
              `min-h-[400px] min-w-[300px] top-[120%] bg-white rounded-2xl absolute z-[100000000] border border-gray-100 `,
              className,
              { "origin-center": config.transformOrigin === "center" },
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

type MenuItemProps = Props & React.JSX.IntrinsicElements['div'] & {
  /**
   * @dev this should be used over the onClick
   * @dev this passes a calllback which can then be used to close the menu
   * */
  onTap?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, close: VoidFunction) => void
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  className,
  ...props
}) => {
  const { setOpen } = useMenu();
  return (
    <div
      {...omit(props, 'onTap')}
      tabIndex={0}
      onClick={(e) => {
        if (props.onTap)
          props.onTap(e, () => setOpen(false))
        else {
          setOpen(false);
          props.onClick?.(e);
        }
      }}
      className={cn(
        "w-full h-fit focus:outline-none focus:bg-gray-100 hover:bg-gray-100 first:rounded-t-[inherit] last:rounded-b-[inherit] px-5 py-3 cursor-pointer border-b border-gray-100 flex items-center justify-between gap-x-3 ",
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * @example
 * ```jsx
 * <Menu>
 *  <Menu.Trigger>
 *    <Button variant='icon'>
 *      <User />
 *    </Button>
 *  </Menu.Trigger>
 *  <Menu.Content>
 *    <Menu.Item>
 *      ...children
 *    </Menu.Item>
 *  </Menu.Content>
 * </Menu> * ```
 */
const Menu = Object.assign(MenuProvider, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
});

export default Menu;
