import { cn } from "@/lib/cn";
import { createContext } from "@/lib/context";
import { FC, NixixAttributes, NixixNode } from "nixix";
import { Show } from "nixix/hoc";
import { ref, effect, memo, Store, store } from "nixix/primitives";

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
	setOpen: (open: boolean) => void;
};

const { Provider, context } = createContext<Store<TPopoverContext>>();

type DoNotUseProps = {
	do_not_use_this_prop?: boolean;
};

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
	do_not_use_this_prop = false,
}: PopoverProps & DoNotUseProps) => {
	const [popoverState, setPopoverState] = store<TPopoverContext>({
		open: do_not_use_this_prop,
		config: {
			transformOrigin: transformOrigin,
		},
		setOpen(open) {
			setPopoverState((p) => ({ ...p, open }));
		},
	});
	return (
		<Provider value={popoverState}>
			{() => (
				<section className={"tws-w-fit tws-h-fit tws-relative"}>
					{children()}
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
	const styleMemo = memo(
		() =>
			open.value
				? {
						zIndex: 100000,
						scale: 1.2,
					}
				: {
						zIndex: 10,
						scale: 1,
					},
		[open],
	);
	return (
		<div
			className={cn(
				"tws-w-fit tws-min-h-fit tws-relative tws-transition-[scale] tws-duration-500",
				className,
			)}
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
	} & NixixAttributes<HTMLDivElement>
> = ({ children, className, onClose, ...props }) => {
	const { setOpen } = context();
	return (
		<div
			{...props}
			className={cn("tws-w-fit tws-h-fit ", className)}
			on:click={() =>
				onClose ? onClose(() => setOpen(false)) : setOpen(false)
			}
		>
			{children}
		</div>
	);
};

const PopoverContent: FC<Props> = ({ children, className }) => {
	const { open, config, setOpen } = context();
	const containerRef = ref<HTMLElement>();
	effect(() => {
		if (open.value) containerRef.current?.focus();
	});
	return (
		<Show when={() => open.value === true}>
			{(isOpen) =>
				isOpen ? (
					<>
						<section
							on:click_self={() => {
								setOpen(false);
							}}
							className="tws-fixed tws-h-screen tws-w-screen !tws-bg-transparent !tws-mt-0 tws-top-0 tws-left-0 tws-z-[99999]"
						></section>
						<section
							bind:ref={containerRef}
							data-open={open}
							tabindex={0}
							className={`tws-transition-transform tws-duration-150 tws-ease-[ease] tws-scale-50 data-[open=true]:tws-scale-100 ${cn(
								` tws-bg-white tws-absolute tws-z-[100000] `,
								className,
								{
									"tws-origin-center":
										config.transformOrigin.value === "center",
								},
								{
									"tws-origin-top-right tws-top-[140%] tws-right-0":
										config.transformOrigin.value === "top-right",
								},
								{
									"tws-origin-top-left tws-top-[140%] tws-left-0":
										config.transformOrigin.value === "top-left",
								},
								{
									"tws-origin-bottom-left tws-bottom-[140%] tws-left-0":
										config.transformOrigin.value === "bottom-left",
								},
								{
									"tws-origin-bottom-right tws-bottom-[140%] tws-right-0":
										config.transformOrigin.value === "bottom-right",
								},
							)} `}
						>
							{children}
						</section>
					</>
				) : (
					""
				)
			}
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
