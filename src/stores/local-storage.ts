import { pipe } from "@/lib/pipe";
import { create } from "zustand/react";

type KeyWithType<T extends string, Type> = {
  key: T;
  type: Type;
};

function keyWithType<T extends string, Type>(key: T): KeyWithType<T, Type> {
  return { key, type: void 0 as Type };
}

const localStorageKeyMap = {
  lastHasBezels: keyWithType<"MobilyResponsive_has_bezels", boolean>("MobilyResponsive_has_bezels"),
  lastAlwaysOnTop: keyWithType<"MobilyResponsive_always_on_top", boolean>("MobilyResponsive_always_on_top"),
} as const;

type LOCALSTORAGE_KEY_MAP = typeof localStorageKeyMap;

type LocalStorageStore = {
  storage: {
    [key in keyof LOCALSTORAGE_KEY_MAP]: LOCALSTORAGE_KEY_MAP[key]["type"];
  };
  setStorage: <K extends keyof LOCALSTORAGE_KEY_MAP>(
    storage: K,
    value: LOCALSTORAGE_KEY_MAP[K]["type"],
  ) => void;
};

type BooleanString = "true" | "false";

const initialState = pipe(() => {
  return [
    localStorage.getItem(
      localStorageKeyMap.lastHasBezels.key,
    ) as NonNullable<BooleanString>,
    localStorage.getItem(
      localStorageKeyMap.lastAlwaysOnTop.key,
    ) as NonNullable<BooleanString>,
  ] as const;
}, ([lastHasBezels, lastAlwaysOnTop]) => {
  return {
    lastHasBezels: JSON.parse(lastHasBezels || 'false') as boolean,
    lastAlwaysOnTop: JSON.parse(lastAlwaysOnTop || 'false') as boolean
  } as const
})

export const useLocalStorage = create<LocalStorageStore>((set, get) => ({
  storage: {
    ...initialState
  },
  setStorage(key, value) {
    const keyInMap = localStorageKeyMap[key];
    localStorage.setItem(keyInMap.key, JSON.stringify(value));
    set({
      ...get(),
      storage: {
        ...get().storage,
        [key]: value,
      }
    });
  },
}));
