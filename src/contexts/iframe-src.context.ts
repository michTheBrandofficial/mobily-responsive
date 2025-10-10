import { createContext, Dispatch, SetStateAction, useContext } from "react";

type IframeSrcContextType = {
  src: string,
  setSrc: Dispatch<SetStateAction<string>>
}

const IframeSrcContext = createContext<IframeSrcContextType | null>(null);

const useIframeSrc = () => {
  const iframeSrcContext = useContext(IframeSrcContext);
  if (!iframeSrcContext) {
    throw new Error("useIframeSrc must be used within a IframeSrcProvider");
  }
  return iframeSrcContext;
};

export {
  IframeSrcContext,
  useIframeSrc
}
