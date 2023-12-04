import { createBinaryString } from '../utils/type-utils';
import { BinaryString } from '../utils/types';

/**
 * Simulate passing data through a medium with chance for the data to be changed
 */
const passThroughChannel: (
  input: BinaryString,
  changeProbability: number,
) => BinaryString = (input, changeProbability) =>
  createBinaryString(
    input
      .split('')
      .map(bit => {
        const shouldChange = Math.random() < changeProbability;
        if (shouldChange) return bit === '0' ? '1' : '0';
        return bit;
      })
      .join(''),
  );

export default passThroughChannel;
