import { createStyles, percentage, sec } from "@/lib/utils";
import React from "react";

const IOSSpinner: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <div style={styles.spinnerWrapper}>
      <div style={styles.spinner}>
        {Array(8)
          .fill("")
          .map((_, i) => {
            const styles = {} as Record<string, any>;
            if (color) styles.backgroundColor = color;
            return (
              <div
                className="tws-w-[4px] tws-h-2 tws-bg-[#A3A3AB] tws-rounded-full tws-fade-animation "
                style={{
                  transform: `rotate(${45 * i}deg) translateY(${percentage(
                    120,
                  )})`,
                  position: "absolute",
                  left: percentage(49),
                  top: percentage(43),
                  animationDelay: sec(i * 0.125),
                  ...styles,
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

const styles = createStyles({
  spinner: {
    position: "relative",
    width: "fit-content",
    height: "fit-content",
    display: "flex",
  },
  spinnerWrapper: {
    width: percentage(100),
    height: percentage(100),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default {
  IOSSpinner: IOSSpinner,
};
