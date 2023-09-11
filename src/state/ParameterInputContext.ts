import { createContext, useContext } from 'react';
import { ValidatedInputValue } from '../utils/types';

interface ParameterInputContextProps {
  pe: ValidatedInputValue<number>;
  n: ValidatedInputValue<number>;
}

export const parameterInputContextPropsInitial: ParameterInputContextProps = {
  pe: {
    status: 'success',
    input: '0.1',
    validValue: 0.1,
  },
  n: {
    status: 'success',
    input: '3',
    validValue: 3,
  },
};

const ParameterInputContext = createContext<ParameterInputContextProps>(
  parameterInputContextPropsInitial,
);

export const useGetParameterInput = () => useContext(ParameterInputContext);

export default ParameterInputContext;
