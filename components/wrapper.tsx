import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";
import React from "react";

interface Props extends HTMLAttributes<HTMLElement> {}

const Wrapper: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <section
      {...rest}
      className={cn(
        "tws-flex tws-w-fit tws-h-fit tws-relative tws-items-center tws-justify-center ",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default Wrapper;
