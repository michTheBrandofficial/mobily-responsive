import { err } from "neverthrow";

export type uint8 = number & { __brand: "uint8" };

export function uint8(value: number) {
  if (value < 0 || value > 255 || !Number.isInteger(value)) {
    throw new Error("Value must be an integer between 0 and 255");
  }
  return value as uint8;
}
