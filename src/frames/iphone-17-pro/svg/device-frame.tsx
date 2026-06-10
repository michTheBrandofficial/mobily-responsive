import { cn } from "@/lib/cn";
import { FC } from "react";

interface Props extends App.SVGProps {
  children?: React.ReactNode;
}

const controlsShadows = {
  controlSilence: `tws-shadow-[-1px_0px_1px_0.3px_rgba(231,229,228,0.6),_-1px_0px_1px_1.5px_rgba(0,0,0,0.8)] `,
  controlVolumeUp: function get() {
    // uses the same shadow because on the same side
    return this.controlSilence;
  },
  controlVolumeDown: function get() {
    // uses the same shadow because on the same side
    return this.controlVolumeUp();
  },
  // reverse x position of first shadow in controlSilence
  controlSideButton: `tws-shadow-[1px_0px_1px_0.3px_rgba(231,229,228,0.6),_1px_0px_1px_1.5px_rgba(0,0,0,0.8)] `,
};

// scale of things from design is 3 so we divide by 3
const Controls: FC<Props> = () => {
  return (
    <>
      {/* control silence */}
      <div
        className={cn(
          "tws-w-[1px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
          // shadow for depth
          controlsShadows.controlSilence,
          "tws-absolute -tws-left-[2px] ",
          "tws-h-[calc(24_/_646_*_var(--container-height))] tws-top-[calc(112_/_646_*_var(--container-height))]"
        )}
      />
      {/* control volume up */}
      <div
        className={cn(
          "tws-w-[1px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
          // shadow for depth
          controlsShadows.controlVolumeUp(),
          "tws-absolute -tws-left-[2px]",
          "tws-h-[calc(45_/_646_*_var(--container-height))] tws-top-[calc(155_/_646_*_var(--container-height))]"
        )}
      />
      {/* control volume down */}
      <div
        className={cn(
          "tws-w-[1px] tws-rounded-l-[1px] tws-bg-[#2C2B31] ",
          // shadow for depth
          controlsShadows.controlVolumeDown(),
          "tws-absolute -tws-left-[2px]",
          "tws-h-[calc(45_/_646_*_var(--container-height))] tws-top-[calc(212_/_646_*_var(--container-height))]"
        )}
      />
      {/* control side button */}
      <div
        className={cn(
          "tws-w-[1px] tws-rounded-r-[1px] tws-bg-[#2C2B31] ",
          // shadow for depth
          controlsShadows.controlSideButton,
          "tws-absolute -tws-right-[2px] ",
          "tws-h-[calc(72_/_646_*_var(--container-height))] tws-top-[calc(185_/_646_*_var(--container-height))]"
        )}
      />
    </>
  );
};

const DeviceFrame: FC<Props> = ({ children }) => {
  const noBezels = false;

  return (
    <div
      id="main-container"
      className="tws-w-fit tws-h-full tws-relative tws-aspect-[655/1363] tws-flex tws-items-center tws-justify-center [container-type:size] "
      style={{
        // @ts-ignore
        // Set based on parent container (which wraps touchable-screen)
        "--base-radius": "calc(90 / 310 * 100cqi)",
        "--container-height": "100cqb",
      }}
    >
      <div
        className={cn(
          "tws-h-full tws-w-fit tws-rounded-[calc(var(--base-radius)+35px/3)] ",
          `tws-shadow-[0px_0px_1px_0.8px_rgba(231,229,228,0.6),_0px_0px_1px_2px_rgba(0,0,0,0.8)] `
        )}
        style={{
          // @ts-ignore
          cornerShape: "superellipse(1.85)",
        }}
      >
        {/* Dark frame */}
        <div
          className={cn(
            "tws-h-full tws-w-fit tws-p-[calc(13px/3)] tws-bg-[#2C2B31] ",
            "tws-rounded-[calc(var(--base-radius)+33px/3)] "
          )}
          style={{
            // @ts-ignore
            cornerShape: "inherit",
          }}
        >
          {/* Black Bezel */}
          <div
            className={cn(
              "tws-h-full tws-w-fit tws-p-[calc(20px/3)] tws-bg-[#060100] ",
              "tws-rounded-[calc(var(--base-radius)+20px/3)] ",
              {
                "tws-invisible": noBezels,
              }
            )}
            style={{
              // @ts-ignore
              cornerShape: "inherit",
            }}
          >
            {/* device touchable screen */}
            <div
              id="touchable-screen"
              className={cn(
                "tws-h-full tws-w-fit tws-aspect-[201/437] tws-max-w-[402px] tws-max-h-[874px] tws-bg-black tws-relative tws-overflow-hidden ",
                "[--radius:calc(var(--base-radius))] tws-rounded-[var(--radius)] "
              )}
              style={{
                // @ts-ignore
                cornerShape: "inherit",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
      <Controls />
    </div>
  );
};

export default DeviceFrame;
