import { HTMLElements, HTMLMotionProps, motion } from "motion/react";
import { RefObject, useEffect, useRef } from "react";

type DevToolsHtmlElements = {
	[Tag in keyof HTMLElements]: React.FunctionComponent<
		HTMLMotionProps<Tag> & {
			children?: React.ReactNode;
		}
	>;
};
const componentCache = new Map<string, React.FunctionComponent<any>>();

const DevSizeComponent = <Tag extends keyof HTMLElements>({
	ref: componentRef,
	...props
}: HTMLMotionProps<Tag> & { tag: Tag }) => {
	const Comp = motion[props.tag];
	const isDev = import.meta.env.DEV;
	const ref = (
		isDev ? (componentRef ?? useRef<HTMLElement>(null)) : componentRef
	) as RefObject<HTMLElement | null>;
	useEffect(() => {
		if (!isDev) return;
		const elSizeClass = "tws-size-display";
		const element = ref.current;
		if (!element) return;
		const eventhandlers = {
			mouseover: (e: React.MouseEvent<HTMLElement>) => {
				e.currentTarget.classList.add(elSizeClass);
				e.currentTarget.dataset.elSize = `${e.currentTarget.offsetWidth}x${e.currentTarget.offsetHeight}`;
			},
			mouseout: (e: React.MouseEvent<HTMLElement>) => {
				e.currentTarget.classList.remove(elSizeClass);
			},
		};
		element.addEventListener("mouseover", eventhandlers.mouseover as any);
		element.addEventListener("mouseout", eventhandlers.mouseout as any);

		return () => {
			element.removeEventListener("mouseover", eventhandlers.mouseover as any);
			element.removeEventListener("mouseout", eventhandlers.mouseout as any);
		};
	}, []);
	return (
		<Comp
			{...(isDev
				? {
						"data-el-size": "",
					}
				: {})}
			{...(props as any)}
			ref={ref as any}
		/>
	);
};

export const devsize = new Proxy({} as DevToolsHtmlElements, {
	get(_, property) {
		const tag = property as string;

		// Return cached component if it exists
		if (componentCache.has(tag)) {
			return componentCache.get(tag)!;
		}

		// Create and cache the component
		const Component = (props: any) => <DevSizeComponent {...props} tag={tag} />;

		componentCache.set(tag, Component);
		return Component;
	},
});
