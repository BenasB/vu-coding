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
import {
  useBinaryPaddingCount,
  useC,
  useVPrime,
  useVPrimeUncoded,
  useY,
} from '../../state/codingMemos';

const RawTabPanel: React.FC = () => {
  const [textInput, setTextInput] = useState<string>('');
  const handleOnTextInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextInput(e.target.value);
  };

  const v = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (textInput.length === 0)
      return {
        status: 'pending',
        input: '',
      };

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

  const padding = useBinaryPaddingCount(v);
  const c = useC(v, padding);
  const y = useY(c);
  const vPrime = useVPrime(y);

  const outputText = useMemo<ValidatedInputValue<string>>(() => {
    if (vPrime.status !== 'success' || padding === undefined)
      return {
        status: 'pending',
        input: '',
      };
    try {
      const text = binaryStringToText(
        createBinaryString(
          vPrime.validValue.substring(0, vPrime.validValue.length - padding),
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
  }, [vPrime, padding]);

  const uncodedOutputText = useVPrimeUncoded(v, binaryStringToText);

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Input</InputLeftAddon>
          <Textarea value={textInput} onChange={handleOnTextInputChange} />
        </InputGroup>
      </FormControl>
      {v.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {v.message}
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
      {vPrime.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {vPrime.message}
        </Alert>
      )}
      <FormControl isInvalid={uncodedOutputText.status === 'fail'}>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>
            Output
            <br />
            (uncoded)
          </InputLeftAddon>
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
