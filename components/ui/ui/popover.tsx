import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

type PopoverContextType = {
  open: boolean
  setOpen: Dispatch<SetStateAction<PopoverContextType['open']>>
  config: {
    transformOrigin: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }
};

const PopoverContext = createContext<PopoverContextType | null>(null);

const usePopover = () => {
  const popoverContent = useContext(PopoverContext);
  if (!popoverContent) {
    throw new Error('usePopover must be used within a PopoverProvider');
  }
  return popoverContent;
}

type PopoverProps = Pick<Props, 'children'> & {
  transformOrigin?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
};

const PopoverProvider = ({ children, transformOrigin = 'center' }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{
      open: isOpen, setOpen: setIsOpen, config: {
        transformOrigin
      }
    }} >
      <section className={cn('tw-w-fit tw-h-fit tw-relative')} >
        {children}
      </section>
    </PopoverContext.Provider>
  )
}

type Props = {
  children?: React.ReactNode;
  className?: string;
}

/**
 * @dev wraps the children in <div> and adds the popover class
 */
const PopoverTrigger: React.FC<Pick<Props, 'children' | 'className'>> = ({ children, className }) => {
  const { setOpen } = usePopover()
  return (
    <div className={cn('tw-w-fit tw-h-fit ', className)} onClick={() => setOpen(true)} >
      {children}
    </div>
  )
}

/**
 * @dev wraps the children in <div> and adds the popover class
 */
const PopoverClose: React.FC<Pick<Props, 'children' | 'className'> & {
  onClose?: (close: () => void) => void;
}> = ({ children, className, onClose }) => {
  const { setOpen } = usePopover()
  return (
    <div className={cn('tw-w-fit tw-h-fit ', className)} onClick={() =>
      onClose ? onClose(() => setOpen(false)) : setOpen(false)} >
      {children}
    </div>
  )
}


/**
 * @dev adding classnames tw-right-0, tw-left-0 to change the position of the popover
 */
const PopoverContent: React.FC<Props> = ({ children, className }) => {
  const { open, setOpen, config } = usePopover();
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
                `tw-min-h-[400px] tw-min-w-[300px] tw-top-[120%] tw-bg-white tw-rounded-3xl tw-absolute tw-z-[100000] tw-border tw-border-gray-100`,
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

/**
 * @example
 * ```jsx
 * <Popover className="" open={open} >
 *  <Popover.Trigger className="tw-p-5 tw-flex tw-justify-between tw-items-center" >
 *    <Button variant='icon' >
 *      <User />
 *    </Button>
 *  </Popover.Trigger>
 *  <Popover.Content className="tw-p-5" >
 *    ...children
 *  </Popover.Content>
 * </Popover>
 * ```
 */
const Popover = Object.assign(PopoverProvider, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
})

export default Popover