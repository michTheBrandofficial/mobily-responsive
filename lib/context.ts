import { NonPrimitive, Store } from "nixix/primitives";

type ContextProviderProps<T> = {
  children: () => Nixix.NixixNode;
  value: T;
};

export function createContext<T extends Store<NonPrimitive>>() {
  const contextCountMap = new Map<number, T>();
  let count = 0;
  return {
    context: () => contextCountMap.get(count) || ({} as T),
    Provider: (props: ContextProviderProps<T>) => {
      const validatedChildren = onlyChild(props.children)
      count += 1;
      contextCountMap.set(count, props.value);
      return validatedChildren();
    },
  };
}

export function onlyChild(children: any) {
  return (children instanceof Array) ? children[0] : children;
}
