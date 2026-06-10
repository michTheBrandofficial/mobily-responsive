import { cn } from "@/lib/cn";
import { HTMLMotionProps, motion } from "motion/react";
import React, { RefAttributes } from "react";

interface Props
  extends HTMLMotionProps<"section">, RefAttributes<HTMLElement> {}

const Wrapper: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <motion.section
      {...rest}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.3,
          duration: 0.2,
        },
      }}
      className={cn(
        "tws-flex tws-relative tws-items-center tws-justify-center ",
        className
      )}
    >
      {/*@ts-ignore*/}
      {children}
    </motion.section>
  );
};

export default Wrapper;
