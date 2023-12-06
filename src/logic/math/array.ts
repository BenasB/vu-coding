interface Sliceable<T> {
  slice: (start?: number | undefined, end?: number | undefined) => T;
  length: number;
}

// Chunks the given sliceable type (e.g. array) into chunks of length n
export const chunk: <T extends Sliceable<T>>(input: T, n: number) => T[] = <
  T extends Sliceable<T>,
>(
  input: T,
  n: number,
) =>
  [...(Array(Math.ceil(input.length / n)) as undefined[])]
    .map((_, index) => index * n)
    .map<T>(begin => input.slice(begin, begin + n));
