import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';


type ModalUnderlayProps = Pick<Props, 'children' | 'className'> & {
  open: boolean;
  onClose: VoidFunction;
}

const ModalUnderLay = ({ children, className, ...props }: ModalUnderlayProps) => {
  const isOpen = useMemo(() => {
    return Boolean(props.open)
  }, [props.open])
  return (
    <AnimatePresence>
      {
        isOpen ? (
          <section className={cn('tw-bg-black/25 ', className, ' tw-w-screen tw-h-screen tw-fixed tw-z-[100000] tw-top-0 tw-left-0 tw-flex tw-items-center tw-justify-center')} onClick={(e) => {
            if (e.target === e.currentTarget) props.onClose()
          }} >
            {children}
          </section>
        ) : ''
      }
    </AnimatePresence>
  )
}

type Props = {
  children?: React.ReactNode;
  className?: string;
}

const ModalBody: React.FC<Props> = ({ children, className }) => {
  return (
    <section className={cn('tw-w-fit tw-h-fit tw-px-3 ')} >
      <motion.section
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={cn(`tw-min-h-[400px] tw-bg-white tw-rounded-3xl`, className)} >
        {children}
      </motion.section>
    </section>
  )

}

/**
 * @example
 * ```jsx
 * <Modal className="" open={open} >
 *  <Modal.Body className="tw-p-5 tw-flex tw-justify-between tw-items-center" >
 *    <button onClick={...} >
 *      <X />
 *    </button>
 *  </Modal.Body>
 * </Modal>
 * ```
 */
const Modal = Object.assign(ModalUnderLay, {
  Body: ModalBody
})

export default Modal