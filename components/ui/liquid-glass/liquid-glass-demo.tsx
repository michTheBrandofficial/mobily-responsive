import LiquidGlass from "./liquid-glass";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pane } from "tweakpane";

/**
 * the pane can read from this directly
 */
let defaultParams = {
  red: -12,
  green: -14,
  blue: -16,
  blur: 0,
};

export function LiquidGlassDemo() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [params, setParams] = useState(defaultParams);

  const presets = {
    apple: { red: -77, green: -78, blue: -76, blur: 0 },
    dramatic: { red: -250, green: -240, blue: -230, blur: 0 },
    default: { red: -12, green: -14, blue: -16, blur: 0 },
    uniform: { red: -120, green: -120, blue: -120, blur: 0 },
    "full-distortion": { red: -150, green: -145, blue: -140, blur: 0 },
  };

  const applyPreset = (preset: keyof typeof presets) => {
    const p = presets[preset];
    setParams(p);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const pane = new Pane({ container: containerRef.current });
    paneRef.current = pane;

    pane
      .addBinding(defaultParams, "red", {
        min: -300,
        max: 300,
        step: 1,
        label: "Red",
      })
      .on("change", (e) => setParams((p) => ({ ...p, red: e.value })));

    pane
      .addBinding(defaultParams, "green", {
        min: -300,
        max: 300,
        step: 1,
        label: "Green",
      })
      .on("change", (e) => setParams((p) => ({ ...p, green: e.value })));

    pane
      .addBinding(defaultParams, "blue", {
        min: -300,
        max: 300,
        step: 1,
        label: "Blue",
      })
      .on("change", (e) => setParams((p) => ({ ...p, blue: e.value })));

    pane
      .addBinding(defaultParams, "blur", {
        min: 0,
        max: 5,
        step: 0.1,
        label: "Blur",
      })
      .on("change", (e) => setParams((p) => ({ ...p, blur: e.value })));

    const presetsFolder = pane.addFolder({ title: "Presets" });
    function applyPresetAndUpdate(preset: keyof typeof presets) {
      return () => {
        applyPreset(preset);
        // pane.refresh();
      };
    }

    presetsFolder
      .addButton({ title: "Apple" })
      .on("click", applyPresetAndUpdate("apple"));
    presetsFolder
      .addButton({ title: "Dramatic" })
      .on("click", applyPresetAndUpdate("dramatic"));
    presetsFolder
      .addButton({ title: "Default" })
      .on("click", applyPresetAndUpdate("default"));
    presetsFolder
      .addButton({ title: "Uniform" })
      .on("click", applyPresetAndUpdate("uniform"));
    presetsFolder
      .addButton({ title: "Full Distortion" })
      .on("click", applyPresetAndUpdate("full-distortion"));

    return () => {
      pane.dispose();
    };
  }, []);

  useEffect(() => {
    if (paneRef.current) {
      Object.assign(defaultParams, params);
      paneRef.current.refresh();
    }
  }, [params]);

  return (
    <section className="tws-min-h-screen tws-bg-white tws-p-8 tws-flex tws-items-center tws-justify-center">
      <section className="tws-w-full tws-max-w-6xl">
        <div className="tws-flex tws-gap-8">
          {/* Preview */}
          <section className="tws-flex-1 tws-flex tws-flex-col tws-items-center">
            <div className="tws-relative tws-w-full tws-h-[500px] tws-rounded-lg tws-overflow-hidden tws-bg-gray-50">
              {/* Test content */}
              <section className="tws-absolute tws-inset-0 tws-flex tws-flex-col tws-items-center tws-justify-center tws-p-8 tws-gap-6">
                <h2 className="tws-text-3xl tws-font-bold tws-text-gray-800">
                  Chromatic Test
                </h2>
                <p className="tws-text-lg tws-text-gray-600 tws-text-center tws-max-w-sm">
                  Adjust the RGB channels to see the refraction effect
                </p>
                <div className="tws-grid tws-grid-cols-3 tws-gap-6 tws-mt-4 tws-relative">
                  <div className="tws-size-60 tws-absolute -tws-z- tws-left-1/2 -tws-translate-x-1/2 tws-bg-red-500 tws-rounded-lg">
                    <img src="https://fastly.picsum.photos/id/841/300/300.jpg?hmac=59ZNBwU1FjRrwpU3J7NDerfr_DHq-JPYXqnyumDt17U" />
                  </div>
                  <div className="tws-size-28 tws-relative tws-z-[1] tws-bg-red-500 tws-rounded-lg" />
                  <div className="tws-size-28 tws-relative tws-z-[1] tws-bg-green-500 tws-rounded-lg" />
                  <div className="tws-size-28 tws-relative tws-z-[1] tws-bg-blue-500 tws-rounded-lg" />
                </div>
              </section>

              {/* Liquid Glass */}
              <motion.div
                initial={{ y: -220, x: "-50%" }}
                animate={{ y: 150, x: "-50%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 6,
                }}
                className="tws-absolute tws-z-10 tws-top-1/4 tws-left-1/2 -tws-translate-x-1/2"
              >
                <LiquidGlass.div
                  color="#7e22ce"
                  chromaticAberration={params}
                  blur={params.blur}
                  saturation={1}
                  className="tws-rounded-3xl purl tws-size-48"
                />
              </motion.div>
            </div>
          </section>

          {/* Tweakpane Controls */}
          <style>
            {`
							:root {
								--tp-base-font-family: Consolas;
                --tp-container-unit-size: 24px;
                --tp-blade-border-radius: 4px;
							}
							.tp-rotv {
								font-size: 12px;
							}
						`}
          </style>
          <div ref={containerRef} />
        </div>
      </section>
    </section>
  );
}
