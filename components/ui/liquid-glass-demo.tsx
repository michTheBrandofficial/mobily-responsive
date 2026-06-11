import LiquidGlass from "@/components/ui/liquid-glass";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { motion } from "motion/react";

/**
 * Interactive demo component for tweaking Liquid Glass refraction parameters
 */
export function LiquidGlassDemo() {
  // Refraction scale controls
  const [refractionRed, setRefractionRed] = useState(-180);
  const [refractionGreen, setRefractionGreen] = useState(-170);
  const [refractionBlue, setRefractionBlue] = useState(-160);
  const [refractionBlur, setRefractionBlur] = useState(0);

  // Toggle between versions
  const [activeVersion, setActiveVersion] = useState<"v1" | "v2">("v1");

  // Presets
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "apple":
        // Apple-style: subtle, minimal chromatic aberration
        setRefractionRed(-80);
        setRefractionGreen(-78);
        setRefractionBlue(-76);
        setRefractionBlur(0);
        break;
      case "dramatic":
        // Strong distortion effect
        setRefractionRed(-250);
        setRefractionGreen(-240);
        setRefractionBlue(-230);
        setRefractionBlur(0);
        break;
      case "default":
        // Original settings
        setRefractionRed(-180);
        setRefractionGreen(-170);
        setRefractionBlue(-160);
        setRefractionBlur(0);
        break;
      case "uniform":
        // No chromatic aberration - uniform distortion
        setRefractionRed(-120);
        setRefractionGreen(-120);
        setRefractionBlue(-120);
        setRefractionBlur(0);
        break;
      case "full-distortion":
        // Distortion everywhere (no center blocking)
        setRefractionRed(-150);
        setRefractionGreen(-145);
        setRefractionBlue(-140);
        setRefractionBlur(0);
        break;
    }
  };

  return (
    <div className="tws-min-h-screen tws-bg-gradient-to-br tws-from-purple-100 tws-via-pink-100 tws-to-blue-100 tws-p-8">
      <div className="tws-max-w-7xl tws-mx-auto">
        <h1 className="tws-text-4xl tws-font-bold tws-mb-8 tws-text-gray-800">
          🔬 Liquid Glass Refraction Lab
        </h1>

        {/* Version Toggle */}
        <div className="tws-bg-white tws-rounded-xl tws-p-4 tws-shadow-lg tws-mb-6">
          <div className="tws-flex tws-gap-4 tws-items-center tws-justify-center">
            <button
              onClick={() => setActiveVersion("v1")}
              className={cn(
                "tws-px-6 tws-py-3 tws-rounded-lg tws-font-semibold tws-transition-all",
                activeVersion === "v1"
                  ? "tws-bg-blue-600 tws-text-white tws-shadow-md"
                  : "tws-bg-gray-100 tws-text-gray-700 hover:tws-bg-gray-200"
              )}
            >
              V1: Original (Strong Chromatic)
            </button>
            <button
              onClick={() => setActiveVersion("v2")}
              className={cn(
                "tws-px-6 tws-py-3 tws-rounded-lg tws-font-semibold tws-transition-all",
                activeVersion === "v2"
                  ? "tws-bg-green-600 tws-text-white tws-shadow-md"
                  : "tws-bg-gray-100 tws-text-gray-700 hover:tws-bg-gray-200"
              )}
            >
              V2: Apple-Style (Dynamic)
            </button>
          </div>
        </div>

        <div className="tws-grid tws-grid-cols-1 lg:tws-grid-cols-2 tws-gap-8">
          {/* Preview Section */}
          <div className="tws-space-y-6">
            <div className="tws-bg-white tws-rounded-xl tws-p-6 tws-shadow-lg">
              <h2 className="tws-text-2xl tws-font-semibold tws-mb-4 tws-text-gray-700">
                Preview
              </h2>

              {/* Preview Area */}
              <div className="tws-relative tws-w-full tws-h-[400px] tws-rounded-lg tws-overflow-hidden tws-bg-gradient-to-br tws-from-yellow-200 tws-via-pink-200 tws-to-purple-300">
                {/* Background content to see refraction */}
                <div className="tws-absolute tws-inset-0 tws-flex tws-flex-col tws-items-center tws-justify-center tws-p-8">
                  <h3 className="tws-text-2xl tws-font-black tws-text-gray-800 tws-mb-4">
                    Add a text oh
                  </h3>
                  <p className="tws-text-2xl tws-text-gray-600 tws-text-center">
                    Watch how the glass refracts this content
                  </p>
                  <div className="tws-mt-8 tws-grid tws-grid-cols-3 tws-gap-4">
                    <div className="tws-w-20 tws-h-20 tws-bg-red-500 tws-rounded-lg" />
                    <div className="tws-w-20 tws-h-20 tws-bg-green-500 tws-rounded-lg" />
                    <div className="tws-w-20 tws-h-20 tws-bg-blue-500 tws-rounded-lg" />
                  </div>
                </div>

                {/* Liquid Glass Element */}
                <motion.div
                  initial={{ y: -220, x: "-50%" }}
                  animate={{ y: 100, x: "-50%" }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 6,
                  }}
                  className="tws-absolute tws-top-[28%] tws-left-1/2 -tws-translate-x-1/2 "
                >
                  <LiquidGlass.div
                    color={"#fff"}
                    mixingPercentage={0}
                    tintOpacity={0.7}
                    tint={"use-color"}
                    refractionRed={refractionRed}
                    refractionGreen={refractionGreen}
                    refractionBlue={refractionBlue}
                    refractionBlur={refractionBlur}
                    saturation={1}
                    className={cn(
                      "tws-rounded-3xl tws-size-48 -fit /tws-px-[110px] /tws-py-[20px] tws-text-[#474844] tws-font-normal tws-flex tws-items-center tws-gap-x-1 tws-text-xs"
                    )}
                  ></LiquidGlass.div>
                </motion.div>
              </div>
            </div>

            {/* Presets */}
            <div className="tws-bg-white tws-rounded-xl tws-p-6 tws-shadow-lg">
              <h2 className="tws-text-xl tws-font-semibold tws-mb-4 tws-text-gray-700">
                Quick Presets
              </h2>
              <div className="tws-grid tws-grid-cols-2 tws-gap-3">
                <button
                  onClick={() => applyPreset("apple")}
                  className="tws-px-4 tws-py-3 tws-bg-gray-100 hover:tws-bg-gray-200 tws-rounded-lg tws-font-medium tws-text-sm tws-transition-colors"
                >
                  🍎 Apple Style
                </button>
                <button
                  onClick={() => applyPreset("default")}
                  className="tws-px-4 tws-py-3 tws-bg-gray-100 hover:tws-bg-gray-200 tws-rounded-lg tws-font-medium tws-text-sm tws-transition-colors"
                >
                  ⚡ Default
                </button>
                <button
                  onClick={() => applyPreset("dramatic")}
                  className="tws-px-4 tws-py-3 tws-bg-gray-100 hover:tws-bg-gray-200 tws-rounded-lg tws-font-medium tws-text-sm tws-transition-colors"
                >
                  💥 Dramatic
                </button>
                <button
                  onClick={() => applyPreset("uniform")}
                  className="tws-px-4 tws-py-3 tws-bg-gray-100 hover:tws-bg-gray-200 tws-rounded-lg tws-font-medium tws-text-sm tws-transition-colors"
                >
                  ⚖️ Uniform
                </button>
                <button
                  onClick={() => applyPreset("full-distortion")}
                  className="tws-px-4 tws-py-3 tws-bg-gray-100 hover:tws-bg-gray-200 tws-rounded-lg tws-font-medium tws-text-sm tws-transition-colors tws-col-span-2"
                >
                  🌊 Full Distortion
                </button>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="tws-space-y-6">
            {/* V1 Controls */}
            {/* Displacement Controls */}
            <div className="tws-bg-white tws-rounded-xl tws-p-6 tws-shadow-lg">
              <h2 className="tws-text-xl tws-font-semibold tws-mb-4 tws-text-gray-700">
                🔴🟢🔵 Displacement Scale (RGB Channels)
              </h2>
              <p className="tws-text-sm tws-text-gray-500 tws-mb-4">
                Different values create chromatic aberration (color fringing)
              </p>

              <div className="tws-space-y-4">
                <div>
                  <label className="tws-flex tws-justify-between tws-text-sm tws-font-medium tws-text-red-600 tws-mb-1">
                    <span>Red Channel</span>
                    <span className="tws-font-mono">{refractionRed}</span>
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    step="1"
                    value={refractionRed}
                    onChange={(e) => setRefractionRed(Number(e.target.value))}
                    className="tws-w-full tws-accent-red-500"
                  />
                </div>

                <div>
                  <label className="tws-flex tws-justify-between tws-text-sm tws-font-medium tws-text-green-600 tws-mb-1">
                    <span>Green Channel</span>
                    <span className="tws-font-mono">{refractionGreen}</span>
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    step="1"
                    value={refractionGreen}
                    onChange={(e) => setRefractionGreen(Number(e.target.value))}
                    className="tws-w-full tws-accent-green-500"
                  />
                </div>

                <div>
                  <label className="tws-flex tws-justify-between tws-text-sm tws-font-medium tws-text-blue-600 tws-mb-1">
                    <span>Blue Channel</span>
                    <span className="tws-font-mono">{refractionBlue}</span>
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    step="1"
                    value={refractionBlue}
                    onChange={(e) => setRefractionBlue(Number(e.target.value))}
                    className="tws-w-full tws-accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filter Effects */}
            <div className="tws-bg-white tws-rounded-xl tws-p-6 tws-shadow-lg">
              <h2 className="tws-text-xl tws-font-semibold tws-mb-4 tws-text-gray-700">
                ✨ Additional Effects
              </h2>

              <div className="tws-space-y-4">
                <div>
                  <label className="tws-flex tws-justify-between tws-text-sm tws-font-medium tws-text-gray-600 tws-mb-1">
                    <span>Blur Amount</span>
                    <span className="tws-font-mono">{refractionBlur}px</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={refractionBlur}
                    onChange={(e) => setRefractionBlur(Number(e.target.value))}
                    className="tws-w-full"
                  />
                </div>
              </div>
            </div>

            {/* Export Code */}
            <div className="tws-bg-white tws-rounded-xl tws-p-6 tws-shadow-lg">
              <h2 className="tws-text-xl tws-font-semibold tws-mb-4 tws-text-gray-700">
                📋 Export Settings
              </h2>
              <pre className="tws-bg-gray-50 tws-p-4 tws-rounded-lg tws-text-xs tws-overflow-x-auto">
                {`<LiquidGlass.div
  refractionRed={${refractionRed}}
  refractionGreen={${refractionGreen}}
  refractionBlue={${refractionBlue}}
  refractionBlur={${refractionBlur}}
>
  {/* Your content */}
</LiquidGlass.div>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
