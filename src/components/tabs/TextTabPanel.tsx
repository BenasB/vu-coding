import {
  Alert,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import {
  binaryStringToText,
  createBinaryString,
  textToBinaryString,
} from '../../utils/type-utils';
import { BinaryString, ValidatedInputValue } from '../../utils/types';
import passThroughChannel from '../../logic/channel';
import { useGetParameterInput } from '../../state/ParameterInputContext';
import { reedMullerEncode } from '../../logic/encoding/rmEncoding';
import { reedMullerDecode } from '../../logic/decoding/rmDecoding';

const RawTabPanel: React.FC = () => {
  const { pe, n, generationMatrix, controlMatrices } = useGetParameterInput();

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

  const padding = useMemo<number | undefined>(
    () =>
      m.status === 'success' && n.status === 'success'
        ? (n.validValue + 1 - (m.validValue.length % (n.validValue + 1))) %
          (n.validValue + 1)
        : undefined,
    [m, n],
  );

  const c = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (
      m.status !== 'success' ||
      n.status !== 'success' ||
      generationMatrix === undefined ||
      padding === undefined
    )
      return { status: 'pending', input: '' };

    try {
      const encodedValue = reedMullerEncode(
        createBinaryString(
          m.validValue.padEnd(m.validValue.length + padding, '0'),
        ),
        n.validValue,
        generationMatrix,
      );
      return {
        status: 'success',
        input: encodedValue,
        validValue: encodedValue,
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
  }, [m, n, generationMatrix, padding]);

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
    if (
      y.status !== 'success' ||
      n.status !== 'success' ||
      controlMatrices === undefined
    ) {
      return {
        status: 'pending',
        input: '',
      };
    }

    try {
      const decodedValue = reedMullerDecode(
        y.validValue,
        controlMatrices,
        n.validValue,
      );
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
  }, [y, n, controlMatrices]);

  const outputText = useMemo<ValidatedInputValue<string>>(() => {
    if (mPrime.status !== 'success' || padding === undefined)
      return {
        status: 'pending',
        input: '',
      };
    try {
      const text = binaryStringToText(
        createBinaryString(
          mPrime.validValue.substring(0, mPrime.validValue.length - padding),
        ),
      );
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
  }, [mPrime, padding]);

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

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Input</InputLeftAddon>
          <Textarea value={textInput} onChange={handleOnTextInputChange} />
        </InputGroup>
      </FormControl>
      {m.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {m.message}
        </Alert>
      )}
      {c.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {c.message}
        </Alert>
      )}
      {y.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {y.message}
        </Alert>
      )}
      {mPrime.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {mPrime.message}
        </Alert>
      )}
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
