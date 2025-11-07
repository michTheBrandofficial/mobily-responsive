import { createContext, RefObject, useContext } from "react";

type IframeRefContextType = {
  ref: RefObject<HTMLIFrameElement | null>;
};

const IframeRefContext = createContext<IframeRefContextType | null>(null);

const useIframeRef = () => {
  const iframeSrcContext = useContext(IframeRefContext);
  if (!iframeSrcContext) {
    throw new Error("useIframeRef must be used within a IframeRefProvider");
  }
  return iframeSrcContext;
};

export { IframeRefContext, useIframeRef };
