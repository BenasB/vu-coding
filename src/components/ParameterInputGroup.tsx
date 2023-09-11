import {
  FormControl,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
} from '@chakra-ui/react';
import React from 'react';
import { ValidatedInputValue } from '../utils/types';

interface Props {
  pe: ValidatedInputValue<number>;
  setPe: React.Dispatch<React.SetStateAction<ValidatedInputValue<number>>>;
  n: ValidatedInputValue<number>;
  setN: React.Dispatch<React.SetStateAction<ValidatedInputValue<number>>>;
}

const ParameterInputGroup: React.FC<Props> = ({ pe, setPe, n, setN }) => {
  const handlePeChange = (valueAsString: string, valueAsNumber: number) => {
    if (isNaN(valueAsNumber))
      setPe({
        status: 'fail',
        input: valueAsString,
        message: 'This probability is not a number',
      });
    else
      setPe({
        status: 'success',
        input: valueAsString,
        validValue: valueAsNumber,
      });
  };

  const handleNChange = (valueAsString: string, valueAsNumber: number) => {
    if (
      isNaN(valueAsNumber) ||
      valueAsNumber <= 0 ||
      valueAsNumber !== Math.floor(valueAsNumber)
    )
      setN({
        status: 'fail',
        input: valueAsString,
        message: 'This is not a natural number',
      });
    else
      setN({
        status: 'success',
        input: valueAsString,
        validValue: valueAsNumber,
      });
  };

  return (
    <>
      <FormControl isInvalid={pe.status === 'fail'}>
        <InputGroup>
          <InputLeftAddon>
            p<sub>e</sub>
          </InputLeftAddon>
          <NumberInput
            step={0.1}
            max={1}
            min={0}
            w="full"
            isRequired
            value={pe.input}
            onChange={handlePeChange}
          >
            <NumberInputField borderLeftRadius={0} />
          </NumberInput>
        </InputGroup>
        {pe.status === 'fail' && (
          <FormErrorMessage>{pe.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={n.status === 'fail'}>
        <InputGroup>
          <InputLeftAddon>n</InputLeftAddon>
          <NumberInput
            min={1}
            w="full"
            isRequired
            value={n.input}
            onChange={handleNChange}
          >
            <NumberInputField borderLeftRadius={0} />
          </NumberInput>
        </InputGroup>
        {n.status === 'fail' && (
          <FormErrorMessage>{n.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default ParameterInputGroup;
