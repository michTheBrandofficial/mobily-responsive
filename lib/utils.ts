import { CSSProperties } from "react";

export const getDims = ({
  width,
  height,
}: Pick<CSSStyleDeclaration, "width" | "height">) => {
  return {
    width: Number(width.replace("px", "")),
    height: Number(height.replace("px", "")),
  };
};

/**
 * @dev removes duplicate elements in an array
 * */
export function deduplicateElements<T extends any[]>(array: T) {
  return Array.from(new Set(array));
}

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Helpers.Prettify<Omit<T, K>> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
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

export function last<T>(value: T[]): T;

export function last(value: string): string;

export function last<T>(value: T[] | string) {
  return value[value.length - 1];
}

type CaseArray<C, R> = [C, R];

/**
 * @dev take this as an inline switch
 * @param check value to check
 * @param cases the cases to check against
 * @returns the return value of the case that matches the check
 */
export function inlineSwitch<
  Return,
  Check = any,
  Case extends Check | Check[] = any,
  Default extends { default: Return } | undefined = undefined,
>(check: Check, ...cases: Array<CaseArray<Case, Return> | Default>) {
  let pickedReturn: Return | undefined = undefined;
  // separate the default case objects from the and return the a destructured array of [defaultCases, caseArrays]
  const [defaultCases, caseArrays] = cases.reduce(
    (acc, caseArray) => {
      if (Array.isArray(caseArray)) {
        acc[1].push(caseArray);
      } else {
        acc[0].push(caseArray);
      }
      return acc;
    },
    [[], []] as [Default[], CaseArray<Case, Return>[]],
  );

  for (let i = 0; i < caseArrays.length; i++) {
    let [caseValue, returnValue] = caseArrays[i];
    let actualCaseValue = Array.isArray(caseValue)
      ? (caseValue as Check[])
      : ([caseValue] as Check[]);
    if (actualCaseValue.includes(check)) {
      pickedReturn = returnValue;
      break;
    }
  }
  if (pickedReturn === undefined && defaultCases.length > 0)
    pickedReturn = last(defaultCases)?.default;
  return pickedReturn as Default extends { default: Return }
    ? Return
    : undefined;
}

export const objectKeys = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

export function entries<T extends Record<string, any>, K extends keyof T>(
  obj: T,
) {
  return Object.entries(obj) as [K, T[K]][];
}

type FindAndPipePredicate<T> = (value: T, index: number) => unknown;

export function findAndPipe<T, R>(
  array: T[],
  predicate: FindAndPipePredicate<T>,
  fn: (value: T) => R,
) {
  const valueInArray = array.find(predicate);
  if (!valueInArray) return undefined;
  else return fn(valueInArray);
}

/**
 * @dev should just be awaited
 */
export async function sleep(delay: number) {
  return new Promise((res, _) => {
    setTimeout(() => res("done sleeping"), delay);
  });
}

export function includes<const T>(values: T[], value: unknown): value is T {
  return values.includes(value as any);
}

/**
 * @dev function implementation of logical `or ||` operator
 * @example
 * ```js
 * <PendingOverlay isPending={
 *   or<boolean>(
 *     [toggleIntakeFormStatus, intakeFormRest.updateIntakeFormMutation, ...(
 *       Object.values(
 *         omit(intakeFormRest.questionMutations, 'reorder')
 *       )
 *     )].map(mut => mut.isPending)
 *   )
 * } />
 * ```
 * */
export function or<T>(values: T[]) {
  return values.reduce((acc, curr) => acc || curr);
}

/**
 * @dev function implementation of logical `and &&` operator
 * @example
 * ```js
 * <PendingOverlay isPending={
 *   and<boolean>(
 *     [toggleIntakeFormStatus, intakeFormRest.updateIntakeFormMutation, ...(
 *       Object.values(
 *         omit(intakeFormRest.questionMutations, 'reorder')
 *       )
 *     )].map(mut => mut.isPending)
 *   )
 * } />
 * ```
 * */
export function and<T>(values: T[]) {
  return values.reduce((acc, curr) => acc && curr);
}

/**
 * @dev negates any JavaScript value
 * */
export function negate(value: any) {
  return !value;
}
