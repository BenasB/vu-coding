import { createContext, useContext } from 'react';
import { ValidatedInputValue } from '../utils/types';
import { Matrix } from '../logic/math/matrix';

interface ParameterInputContextProps {
  pe: ValidatedInputValue<number>;
  m: ValidatedInputValue<number>;
  generationMatrix: Matrix | undefined;
  controlMatrices: Matrix[] | undefined;
}

export const parameterInputContextPropsInitial: ParameterInputContextProps = {
  pe: {
    status: 'success',
    input: '0.1',
    validValue: 0.1,
  },
  m: {
    status: 'success',
    input: '3',
    validValue: 3,
  },
  generationMatrix: undefined,
  controlMatrices: undefined,
};

const ParameterInputContext = createContext<ParameterInputContextProps>(
  parameterInputContextPropsInitial,
);

export const useGetParameterInput = () => useContext(ParameterInputContext);

export default ParameterInputContext;
