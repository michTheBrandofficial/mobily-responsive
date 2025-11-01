import React, { MouseEventHandler } from "react";
import Tools from "@/assets/images/tools icon.png";
import { motion } from "motion/react";

const HomeScreenIcon: React.FC<{
  icon: {
    name: string;
    icon: string;
  };
  onClick: MouseEventHandler<HTMLDivElement>;
}> = ({ icon: { icon, name }, ...rest }) => {
  const isUntitled = icon === Tools;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={rest.onClick}
      className="tws-w-[60px] tws-h-fit tws-rounded-[16px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer tws-overflow-x-visible "
    >
      {isUntitled ? (
        <div className="tws-w-[60px] tws-h-[60px] tws-bg-white tws-flex tws-items-center tws-justify-center tws-rounded-[inherit] ">
          <img
            src={Tools}
            alt={"Untitled"}
            className="tws-h-[62%] tws-w-[62%] tws-rounded-[inherit] "
          />
        </div>
      ) : (
        <img
          src={icon}
          alt={name}
          className="tws-w-[60px] tws-h-[60px] tws-rounded-[inherit]  "
        />
      )}
      <p
        className={`/tws-text-white tws-min-w-[75px] tws-overflow-visible tws-text-center tws-text-[#474844] tws-text-[11px] tws-whitespace-nowrap tws-max-w-full tws-font-Rubik tws-font-normal `}
      >
        {name.length > 10 ? name.slice(0, 10).concat("...") : name}
      </p>
    </motion.div>
  );
};

export default HomeScreenIcon;
