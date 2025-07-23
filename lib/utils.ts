import { CSSProperties } from "nixix";

export const getDims = ({ width, height }: CSSStyleDeclaration) => {
	return {
		width: Number(width.replace("px", "")),
		height: Number(height.replace("px", "")),
	};
};

export const px = <V extends string | number>(value: V): `${V}px` =>
	`${value}px`;

export const deg = <V extends string | number>(value: V): `${V}deg` =>
	`${value}deg`;

export const sec = <V extends string | number>(value: V): `${V}s` =>
	`${value}s`;

export const percentage = <V extends string | number>(value: V): `${V}%` =>
	`${value}%`;

export const createStyles = <
	Props extends CSSProperties,
	S extends {
		[index: string]: Readonly<Props>;
	},
>(
	styles: S,
) => styles;

export const pick = <O extends Record<string, any>, K extends keyof O>(
	obj: O,
	...keys: K[]
) => {
	const emptyObj = {} as Record<K, any>;
	keys.forEach((k) => (emptyObj[k] = obj[k]));
	return emptyObj;
};

export const round = Math.round;

export const noop = () => undefined;

export const isLocalHost = (url: string) => url.includes("localhost");

export const prefixWithSlash = (str: string): string => {
	return str.startsWith("/") ? str : `/${str}`;
};

export const blobToBinary = async (blob: Blob) => {
	const buffer = await blob.arrayBuffer();

	return new Uint8Array(buffer);
};

export const toReversed = (arr: any[]) => structuredClone(arr).reverse();

export const prefixWithProtocol = (url: string) => {
	url = url || "localhost:3000";
	switch (true) {
		case isLocalHost(url):
			return url.startsWith("http") ? url : `http://`.concat(url);
		default:
			return url.startsWith("https") ? url : `https://`.concat(url);
	}
};

export const wait = (fn: () => void, delay = 500) => setTimeout(fn, delay);

export const debounce = <T extends VoidFunction | Utilities.FunctionWithArgs>(
	fn: T,
	delta = 500,
): T => {
	let timer: any;
	return ((...args: any[]) => {
		clearTimeout(timer);
		timer = wait(() => {
			fn(...args);
		}, delta);
	}) as T;
};

export const removeChildren = (element: Element) => {
	Array.from(element.children).forEach((child) => child.remove());
};

// capitalize first letter
export const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

