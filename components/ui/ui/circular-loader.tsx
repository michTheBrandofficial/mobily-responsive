import { cn } from "@/lib/utils";
import { px } from "@/src/shared/helpers";
import { CSSProperties } from "react";

type Props = Omit<React.JSX.IntrinsicElements["div"], 'color'> & {
  color?: CSSProperties['color']
  size?: number
}

const CircularLoader = (props: Props) => {
  return (
    <div className="tw-flex tw-items-center tw-justify-center">
      <div className={
        cn(
          " tw-border-2 tw-border-white tw-rounded-full tw-animate-spin tw-ease-[ease] tw-duration-700",
          props.className
        )
      }
        style={{
          borderLeftColor: props.color || "#e91e63",
          borderRightColor: props.color || "#e91e63",
          borderBottomColor: props.color || "#e91e63",
          borderTopColor: "transparent",
          width: px(props.size || 24),
          height: px(props.size || 24),
        }}
      ></div>
    </div>
  );
};

export default CircularLoader;
