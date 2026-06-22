import { Button } from "@/components/ui/buttons";
import LiquidGlass from "@/components/ui/liquid-glass/liquid-glass";
import { cn } from "@/lib/cn";
import {
  PauseFill,
  PlayFill,
  Multiply,
  // @ts-expect-error
} from "framework7-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { CSSProperties, useEffect, useMemo, useState } from "react";

/**
 * @dev parses to int and prepends all numbers.
 * @example `10` -> `10`
 * 					`3` -> `03`
 */
function parseAndPrependZero(int: number) {
  int = parseInt(int.toString());
  return int > 9 ? int.toString() : `0${int}`;
}

function formatSecsAndMins(seconds: number) {
  const [secs, mins] = [
    parseAndPrependZero(seconds % 60),
    parseAndPrependZero(Math.trunc(seconds / 60)),
  ] as const;

  return `${mins}:${secs}`;
}

/**
 * @dev we don't allow past 1 hour;
 */
const MAX_SECONDS = 3599;
const TIME_FOR_VISUAL_FEEDBACK = 3540;

const View = () => {
  const [seconds, setSeconds] = useState(0);
  // default false, because we have to play it
  const [isRunning, setIsRunning] = useState(false);
  const formattedTime = useMemo(() => {
    return formatSecsAndMins(seconds);
  }, [seconds]);
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        const newSeconds = s + 1;
        if (newSeconds >= MAX_SECONDS) {
          setIsRunning(false); // Stop the timer
          return MAX_SECONDS; // Cap at 1 hour
        }
        return newSeconds;
      });
    }, 1000); // 1 second
    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  return (
    <section className="tws-w-full tws-select-none tws-max-w-[320px] tws-p-2 ">
      <LiquidGlass.div
        frost={seconds < TIME_FOR_VISUAL_FEEDBACK ? 0.53 : 0.35}
        className={cn(
          "tws-h-fit tws-w-full tws-rounded-[120px] tws-overflow-hidden ",
          " tws-px-4 tws-py-3 tws-font-medium tws-flex tws-justify-between",
          " tws-flex !tws-shadow-none "
        )}
        style={{
          // @ts-ignore
          cornerShape: "superellipse(1.5)",
        }}
      >
        <Button
          onTap={() => setIsRunning((bool) => !bool)}
          whileTap={{ filter: "blur(2px)" }}
          className="!tws-rounded-full !tws-p-2 !tws-bg-amber-500/30 !tws-text-amber-500 tws-mr-2 "
        >
          <AnimatePresence mode="popLayout">
            {isRunning ? (
              <motion.div key={"pause"}>
                <PauseFill className={"tws-size-7"} />
              </motion.div>
            ) : (
              <motion.div key={"play"}>
                <PlayFill className={"tws-size-7 tws-translate-x-0.5 "} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        <Button
          onTap={() => {
            setSeconds(0);
            setIsRunning(false);
          }}
          className="!tws-rounded-full !tws-p-2 tws-bg-white/30 tws-backdrop-blur-xl tws-text-white "
        >
          <Multiply className={"tws-size-7"} />
        </Button>
        {/* this for dragging window */}
        <div
          data-tauri-drag-region
          style={{ "app-region": "drag" } as CSSProperties}
          className="tws-flex-grow tws-bg-transparent tws-h-11 tws-cursor-grab "
        ></div>
        <div
          className={cn(
            "tws-flex tws-font-SF_Pro_Display tws-items-end tws-gap-1 tws-ml-auto",
            {
              "tws-text-amber-500": seconds < TIME_FOR_VISUAL_FEEDBACK,
              "tws-text-red-700": seconds >= TIME_FOR_VISUAL_FEEDBACK,
            }
          )}
        >
          <p className="tws-font-medium tws-transition-colors ">Timer</p>
          <p className="tws-font-normal tws-text-3xl tws-tabular-nums tws-transition-colors">
            {formattedTime}
          </p>
        </div>
      </LiquidGlass.div>
    </section>
  );
};

export default View;
