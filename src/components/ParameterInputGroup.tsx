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
  m: ValidatedInputValue<number>;
  setN: React.Dispatch<React.SetStateAction<ValidatedInputValue<number>>>;
}

const ParameterInputGroup: React.FC<Props> = ({ pe, setPe, m, setN }) => {
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
      <FormControl isInvalid={m.status === 'fail'}>
        <InputGroup>
          <InputLeftAddon>m</InputLeftAddon>
          <NumberInput
            min={1}
            w="full"
            isRequired
            value={m.input}
            onChange={handleNChange}
          >
            <NumberInputField borderLeftRadius={0} />
          </NumberInput>
        </InputGroup>
        {m.status === 'fail' && (
          <FormErrorMessage>{m.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default ParameterInputGroup;
