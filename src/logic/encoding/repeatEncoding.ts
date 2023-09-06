import { BinaryString } from '../../utils/types';

const repeatEncode: (input: BinaryString, n: number) => BinaryString = (
  input,
  n,
) =>
  input.reduce<BinaryString>((accumulator, currentValue) => {
    const bits: BinaryString = [...(Array(n) as undefined[])].map(
      () => currentValue,
    );
    return accumulator.concat(bits);
  }, []);

export default repeatEncode;
