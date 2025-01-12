import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

type MenuContextType = {
  open: boolean
  setOpen: Dispatch<SetStateAction<MenuContextType['open']>>
  config: {
    transformOrigin: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }
};

const MenuContext = createContext<MenuContextType | null>(null);

const useMenu = () => {
  const menuContext = useContext(MenuContext);
  if (!menuContext) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return menuContext;
}

type MenuProps = Pick<Props, 'children'> & {
  transformOrigin?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
};

const MenuProvider = ({ children, transformOrigin = 'center' }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ open: isOpen, setOpen: setIsOpen, config: {
      transformOrigin
    } }} >
      <section className={cn('tw-w-fit tw-h-fit tw-relative')} >
        {children}
      </section>
    </MenuContext.Provider>
  )
}

type Props = {
  children?: React.ReactNode;
  className?: string;
}

/**
 * @dev wraps the children in <div> and adds the menu class
 */
const MenuTrigger: React.FC<Pick<Props, 'children' | 'className'>> = ({ children, className }) => {
  const { setOpen } = useMenu()
  return (
    <div className={cn('tw-w-fit tw-h-fit ', className)} onClick={() => setOpen(true)} >
      {children}
    </div>
  )

}

const MenuContent: React.FC<Props> = ({ children, className }) => {
  const { open, setOpen, config } = useMenu();
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) containerRef.current?.focus();
  }, [open])
  return (
    <AnimatePresence>
      {
        open ? (
          <>
            <section
              onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false)
              }}
              className='tw-fixed tw-h-screen tw-w-screen !tw-mt-0 tw-top-0 tw-left-0 tw-z-[99999]' ></section>
            <motion.section
              ref={containerRef}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              tabIndex={0}
              className={cn(
                `tw-min-h-[400px] tw-min-w-[300px] tw-top-[120%] tw-bg-white tw-rounded-3xl tw-absolute tw-z-[100000] tw-border tw-border-gray-100 `,
                className,
                { 'tw-origin-center': config.transformOrigin === 'center' },
                { 'tw-origin-top-right': config.transformOrigin === 'top-right' },
                { 'tw-origin-top-left': config.transformOrigin === 'top-left' },
                { 'tw-origin-bottom-left': config.transformOrigin === 'bottom-left' },
                { 'tw-origin-bottom-right': config.transformOrigin === 'bottom-right' },
                )} >
              {children}
            </motion.section>
          </>
        ) : ''
      }
    </AnimatePresence>
  )
}

const MenuItem: React.FC<Props & React.JSX.IntrinsicElements['div']> = ({ children, className, ...props }) => {
  const { setOpen } = useMenu()
  return (
    <div 
      {...props} 
      tabIndex={0} onClick={(e) => {
        setOpen(false)
        props.onClick?.(e)
      }} 
      className={cn('tw-w-full tw-h-fit focus:tw-outline-none focus:tw-bg-gray-100 hover:tw-bg-gray-100 first:tw-rounded-t-[inherit] last:tw-rounded-b-[inherit] tw-pl-5 tw-py-3 tw-cursor-pointer tw-border-b tw-border-gray-100', className)} >
      {children}
    </div>
  )
}

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
})

export default Menu