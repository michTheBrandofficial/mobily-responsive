import { cn } from "@/lib/cn";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import React, { useMemo } from "react";

export type BaseModalProps = {
	open: boolean;
	onClose: VoidFunction;
};

type ModalUnderlayProps = Pick<Props, "children" | "className"> &
	BaseModalProps & {
		noBlur?: boolean;
	};

const ModalUnderLay = ({
	children,
	className,
	noBlur = true,
	...props
}: ModalUnderlayProps) => {
	const isOpen = useMemo(() => {
		return Boolean(props.open);
	}, [props.open]);
	return (
		<AnimatePresence mode="sync">
			{isOpen ? (
				<motion.section
					key={"modal-underlay"}
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{
						opacity: 0,
						transition: {
							duration: 0.2,
						},
					}}
					className={cn(
						{ "tws-bg-black/25 tws-backdrop-blur-[2px]": !noBlur },
						{ "tws-bg-transparent": noBlur },
						className,
						"!tws-mt-0 tws-w-screen tws-h-screen tws-fixed tws-z-[100000] tws-top-0 tws-left-0 tws-flex tws-items-center tws-justify-center",
					)}
					onClick={(e) => {
						if (e.target === e.currentTarget) props.onClose();
					}}
				>
					{children}
				</motion.section>
			) : (
				""
			)}
		</AnimatePresence>
	);
};

type Props = {
	children?: React.ReactNode;
	className?: string;
};

type ModalBodyProps = Pick<Props, "children" | "className"> &
	HTMLMotionProps<"section">;

const ModalBody: React.FC<ModalBodyProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<section className={cn("tws-w-fit tws-h-fit tws-px-3 ")}>
			<motion.section
				key={"modal"}
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{
					opacity: 0,
					y: 60,
					transition: {
						duration: 0.2,
					},
				}}
				className={cn(className)}
				// for override of the default animation
				{...props}
			>
				{children}
			</motion.section>
		</section>
	);
};

/**
 * @example
 * ```jsx
 * <Modal className="" open={open} >
 *  <Modal.Body className="p-5 flex justify-between items-center" >
 *    <LiquidGlass.div className={...} >
 *      {...}
 *    </LiquidGlass.div>
 *  </Modal.Body>
 * </Modal>
 * ```
 */
const Modal = Object.assign(ModalUnderLay, {
	/**
	 * @dev this is a headless component, bring your liquid glass style or what ever you want here.
	 */
	Body: ModalBody,
});

export default Modal;
