import {
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { binaryStringToText, textToBinaryString } from '../../utils/type-utils';
import { BinaryString, ValidatedInputValue } from '../../utils/types';
import passThroughChannel from '../../logic/channel';
import { useGetParameterInput } from '../../state/ParameterInputContext';
import repeatEncode from '../../logic/encoding/repeatEncoding';
import repeatDecode from '../../logic/decoding/repeatDecoding';

const RawTabPanel: React.FC = () => {
  const { pe, n } = useGetParameterInput();

  const [textInput, setTextInput] = useState<string>('');
  const handleOnTextInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
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

  const c = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (m.status !== 'success' || n.status !== 'success')
      return { status: 'pending', input: '' };

    const encodedValue = repeatEncode(m.validValue, n.validValue);

    return {
      status: 'success',
      input: encodedValue,
      validValue: encodedValue,
    };
  }, [m, n]);

  const y = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (pe.status !== 'success' || c.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    const newY = passThroughChannel(c.validValue, pe.validValue);
    return {
      status: 'success',
      input: newY,
      validValue: newY,
    };
  }, [pe, c]);

  const mPrime = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (y.status !== 'success' || n.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    try {
      const decodedValue = repeatDecode(y.validValue, n.validValue);
      return {
        status: 'success',
        input: decodedValue,
        validValue: decodedValue,
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
        message: 'Ran into a problem while decoding',
      };
    }
  }, [y, n]);

  const uncodedOutputText = useMemo<ValidatedInputValue<string>>(() => {
    if (pe.status !== 'success' || m.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    const mPrimeUncoded = passThroughChannel(m.validValue, pe.validValue);

    try {
      const text = binaryStringToText(mPrimeUncoded);
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
  }, [pe, m]);

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
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Input</InputLeftAddon>
          <Textarea value={textInput} onChange={handleOnTextInputChange} />
        </InputGroup>
      </FormControl>
      <FormControl isInvalid={uncodedOutputText.status === 'fail'}>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Output (uncoded)</InputLeftAddon>
          <Textarea value={uncodedOutputText.input} isReadOnly />
        </InputGroup>
        {uncodedOutputText.status === 'fail' && (
          <FormErrorMessage>{uncodedOutputText.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={outputText.status === 'fail'}>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Output</InputLeftAddon>
          <Textarea value={outputText.input} isReadOnly />
        </InputGroup>
        {outputText.status === 'fail' && (
          <FormErrorMessage>{outputText.message}</FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  );
};

export default RawTabPanel;
