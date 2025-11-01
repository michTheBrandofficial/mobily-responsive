import { inlineSwitch, px } from "@/lib/utils";
import { useTheme } from "../stores/theme";
import React from "react";

type VirtualHomeButtonProps = React.JSX.IntrinsicElements["div"] & {
  bgColor?: /*dark*/ "#000" | /*light*/ "#fff";
};

const VirtualHomeButton: React.FC<VirtualHomeButtonProps> = ({
  className = "",
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const bgColor = inlineSwitch(theme, ["dark", "#000"], { default: "#fff" });
  return (
    <div
      className={className}
      {...rest}
      style={{
        height: px(4),
        borderRadius: px(50),
        ...style,
        // this is down because we have only two states: dark mode and light mode
        backgroundColor: bgColor,
      }}
    />
  );
};

export default VirtualHomeButton;
