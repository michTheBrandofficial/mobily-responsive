import { first, last, omit } from "@/lib/utils";
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
import LiquidGlass from "./liquid-glass";

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
    noBlur: boolean | undefined;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
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
  // for here I'd like noblur
  noBlur = true,
  ...props
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <MenuContext.Provider
      value={{
        open: isOpen,
        setOpen: setIsOpen,
        config: {
          transformOrigin,
          noBlur: noBlur,
        },
        containerRef,
      }}
    >
      <section
        className={cn(props.className, " tws-w-fit tws-h-fit tws-relative")}
      >
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
      className={cn(
        "tws-w-fit tws-h-fit tws-relative tws-p-0 tws-bg-transparent tws-text-inherit tws-cursor-pointer ",
        className,
        {
          "tws-relative tws-z-[100000000]": shouldHaveHighZIndex,
        },
      )}
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
  const { open, setOpen, config, containerRef } = useMenu();
  useEffect(() => {
    // focus on first menu item
    if (!open) return;
    const firstMenuItem =
      // find the active one first then find the first one
      containerRef.current?.querySelector<HTMLDivElement>(".lg-menu-item.active") ??
      containerRef.current?.querySelector<HTMLDivElement>(".lg-menu-item");
    if (firstMenuItem) firstMenuItem.focus();
  }, [open]);
  return (
    <AnimatePresence mode="sync">
      {open ? (
        <>
          <motion.section
            key={"menu-underlay"}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.2,
              },
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className={cn(
              "tws-fixed tws-h-screen tws-w-screen tws-bg-transparent !tws-mt-0 tws-top-0 tws-left-0 tws-z-[10000000]",
              {
                "tws-bg-white/25 tws-backdrop-blur-[2px]": !config.noBlur,
              },
            )}
          ></motion.section>
          <LiquidGlass.div
            ref={containerRef}
            key={"menu"}
            color={'#ffffff'}
            mixingPercentage={50}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{
              scale: 0.5,
              opacity: 0,
              transition: {
                duration: 0.2,
              },
            }}
            tabIndex={0}
            className={cn(
              "tws-min-h-[220px] tws-min-w-[240px] tws-top-[120%] tws-rounded-[32px] tws-absolute tws-z-[100000000] tws-p-2 tws-space-y-2 ",
              className,
              { "tws-origin-center": config.transformOrigin === "center" },
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
              },
            )}
          >
            {children}
          </LiquidGlass.div>
        </>
      ) : (
        ""
      )}
    </AnimatePresence>
  );
};

type MenuItemProps = Props &
  Omit<HTMLMotionProps<"div">, "onClick" | "onTap"> & {
    onTap?: (close: VoidFunction) => void;
    isActive?: boolean;
    noBgColorStates?: boolean;
  };

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  className,
  isActive,
  noBgColorStates,
  ...props
}) => {
  const { setOpen, containerRef } = useMenu();
  return (
    <motion.div
      tabIndex={1}
      whileTap={{ scale: 0.9 }}
      {...omit(props, "onTap")}
      onTap={() => {
        console.log('onTap and whileTap handled for Enter key press')
        props.onTap?.(() => setOpen(false));
      }}
      onKeyUp={(e) => {
        e.preventDefault()
        if (e.key === "Enter") {
          props.onTap?.(() => setOpen(false));
        } else if (e.key === "Escape") {
          setOpen(false);
        } else if (e.key === "ArrowUp") {
          // go to last item
          const items = Array.from(
            containerRef.current?.querySelectorAll(".lg-menu-item") || [],
          );
          const index = items.indexOf(e.target as HTMLElement);
          (
            ((items[index - 1] ||
              last(items)) /* focus trap here */ as HTMLElement) || null
          )?.focus();
        } else if (e.key === "ArrowDown") {
          // go to next item
          const items = Array.from(
            containerRef.current?.querySelectorAll(".lg-menu-item") || [],
          );
          const index = items.indexOf(e.target as HTMLElement);
          (
            ((items[index + 1] ||
              first(items)) /* focus trap here */ as HTMLElement) || null
          )?.focus();
        }
      }}
      className={cn("lg-menu-item focus:tws-outline-none  tws-rounded-[24px] tws-cursor-pointer tws-transition-colors tws-duration-150", {
        'active': isActive,
        'focus:tws-bg-white/50 hover:tws-bg-white/50': !noBgColorStates
      })}
    >
      <motion.div
        className={cn(
          "tws-w-full tws-h-fit tws-rounded-[inherit] tws-px-3.5 tws-py-2 tws-cursor-pointer tws-flex tws-items-center tws-justify-between tws-gap-x-3 ",
          className,
        )}
      >
        {children}
      </motion.div>
    </motion.div>
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
