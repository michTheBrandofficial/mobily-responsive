import { uint8 } from "@/lib/number";

export type HexColor = `#${string}`;
export type RgbColor = [uint8, uint8, uint8];
export type OklchColor = [hue: number, chroma: number, lightness: number];

/**
 * Convert sRGB value (0-255) to linear RGB (0-1)
 */
function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB to XYZ color space (D65 illuminant)
 */
function linearRgbToXyz(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
  return [x, y, z];
}

/**
 * Convert XYZ to Oklab (perceptually uniform)
 */
function xyzToOklab(x: number, y: number, z: number): [number, number, number] {
  // XYZ to LMS
  const l = x * 0.8189330101 + y * 0.3329845289 + z * -0.1288641902;
  const m = x * 0.0329845436 + y * 0.9292418715 + z * 0.0361456387;
  const s = x * 0.0482003018 + y * 0.2642591811 + z * 0.633851707;

  // LMS to Oklab (apply cube root)
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  return [L, a, b];
}

/**
 * Convert Oklab to OKLCH (cylindrical coordinates)
 */
function oklabToOklch(
  L: number,
  a: number,
  b: number
): [number, number, number] {
  const C = Math.sqrt(a * a + b * b);
  let H = Math.atan2(b, a) * (180 / Math.PI);
  if (H < 0) H += 360;
  return [Math.round(L * 100), Number(C.toFixed(3)), Math.round(H)]; // Return exact decimals for C and L
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: HexColor): RgbColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? ([
        parseInt(result[1] as any, 16),
        parseInt(result[2] as any, 16),
        parseInt(result[3] as any, 16),
      ] as RgbColor)
    : ([255, 255, 255] as RgbColor);
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(r: uint8, g: uint8, b: uint8): OklchColor {
  const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const [x, y, z] = linearRgbToXyz(lr, lg, lb);
  const [L, a, b_val] = xyzToOklab(x, y, z);
  return oklabToOklch(L, a, b_val);
}

/**
 * Convert color (hex or RGB) to OKLCH
 * Returns [hue (0-360), chroma (0-~0.4), lightness (0-1)]
 */
export function colorToOklch(color: HexColor | RgbColor): OklchColor {
  const [r, g, b] = typeof color === "string" ? hexToRgb(color) : color;
  return rgbToOklch(r, g, b);
}
