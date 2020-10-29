export * from "./tax";
export * from "./style";

export const numberInRange = (
  value: number,
  min: number,
  max: number
): number => Math.min(max ?? Infinity, Math.max(value, min ?? -Infinity));
