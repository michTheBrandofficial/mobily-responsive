import { inlineSwitch } from "@/lib/utils";
import { useTheme } from "../stores/theme";
import React from "react";
import { cn } from "@/lib/cn";

type HomeIndicatorProps = React.JSX.IntrinsicElements["div"] & {
  bgColor?: /*dark*/ "#000" | /*light*/ "#fff";
};

const HomeIndicator: React.FC<HomeIndicatorProps> = ({
  className = "",
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const bgColor = inlineSwitch(theme, ["dark", "#000"], { default: "#fff" });
  return (
    <div
      className={cn(className, "tws-h-1 tws-rounded-full")}
      {...rest}
      style={{
        ...style,
        // this is down because we have only two states: dark mode and light mode
        backgroundColor: bgColor,
      }}
    />
  );
};

export default HomeIndicator;
