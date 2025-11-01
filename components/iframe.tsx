import { cn } from "@/lib/cn";
import { percentage } from "@/lib/utils";
import Loaders from "./loaders";
import React, { useState } from "react";

interface Props extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
}

/**
 * The height and width of this iframe is 100%;
 * It also has tws-no-scroll on it
 */
const Iframe: React.FC<Props> = ({ style = {}, className, src, ...props }) => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      {loading && <Loaders.IOSSpinner />}
      <iframe
        {...props}
        src={src}
        onLoad={() => setLoading(false)}
        className={cn("tws-no-scroll ", className)}
        allow="clipboard-read; clipboard-write"
        style={{
          ...style,
          width: percentage(100),
          height: percentage(100),
        }}
      />
    </>
  );
};

export default Iframe;
