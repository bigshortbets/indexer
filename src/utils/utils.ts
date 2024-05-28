import { Call } from "@subsquid/substrate-processor";

export function searchInArray(
  arr: Call[],
  field: keyof Call,
  value: any,
): Call | undefined {
  return arr.find((element) => element[field] === value);
}
