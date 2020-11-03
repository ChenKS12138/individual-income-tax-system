export * from "./tax";
export * from "./style";
export * from "./hooks";

/**
 * min <= value <= max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const numberInRange = (
  value: number,
  min: number,
  max: number
): number => Math.min(max ?? Infinity, Math.max(value, min ?? -Infinity));

/**
 * 使大数组稀疏
 * @param {Array} arr
 * @param {number} cap
 * @returns {Array}
 */
export const rarefyArray = <T = any>(arr: T[], cap: number): T[] => {
  if (arr.length <= cap) return arr;
  const step = Math.floor(arr.length / cap);
  return Array.from({ length: cap }).map((v, key) => arr[key * step]);
};

export function iterator(time: number, start: number = 0, step: number = 1) {
  return function (callback) {
    for (let i = 0; i < time; i++) {
      callback(start);
      start += step;
    }
  };
}
