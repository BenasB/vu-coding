import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import BaseTabPanel from './BaseTabPanel';
import { binaryStringToText, textToBinaryString } from '../../utils/type-utils';
import { BinaryString, ValidatedInputValue } from '../../utils/types';

const RawTabPanel: React.FC = () => {
  const [textInput, setTextInput] = useState<string>('');
  const handleOnTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const m = useMemo<ValidatedInputValue<BinaryString>>(() => {
    try {
      const binaryString = textToBinaryString(textInput);
      return {
        status: 'success',
        input: binaryString,
        validValue: binaryString,
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: 'fail',
          input: '',
          message: err.message,
        };
      }

      return {
        status: 'fail',
        input: '',
        message: 'Ran into a problem while converting input text to binary',
      };
    }
  }, [textInput]);

  const [mPrime, setMPrime] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const outputText = useMemo<ValidatedInputValue<string>>(() => {
    if (mPrime.status !== 'success')
      return {
        status: 'pending',
        input: '',
      };
    try {
      const text = binaryStringToText(mPrime.validValue);
      return {
        status: 'success',
        input: text,
        validValue: text,
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: 'fail',
          input: '',
          message: err.message,
        };
      }

      return {
        status: 'fail',
        input: '',
        message: 'Ran into a problem while converting m prime to text',
      };
    }
  }, [mPrime]);

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup>
          <InputLeftAddon>Input</InputLeftAddon>
          <Input value={textInput} onChange={handleOnTextInputChange} />
        </InputGroup>
      </FormControl>
      <BaseTabPanel m={m} mPrime={mPrime} setMPrime={setMPrime} />
      <FormControl isInvalid={outputText.status === 'fail'}>
        <InputGroup>
          <InputLeftAddon>Output</InputLeftAddon>
          <Input value={outputText.input} isReadOnly />
        </InputGroup>
        {outputText.status === 'fail' && (
          <FormErrorMessage>{outputText.message}</FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  );
};

export default RawTabPanel;
