import {
  InputGroup,
  InputLeftAddon,
  Input,
  InputProps,
  FormControl,
  FormErrorMessage,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import { BinaryString, ValidatedInputValue } from '../utils/types';
import { isBinaryString, createBinaryString } from '../utils/type-utils';

interface Props {
  value: ValidatedInputValue<BinaryString>;
  onChange?: (newValue: ValidatedInputValue<BinaryString>) => void;
  title?: string | JSX.Element;
  inputProps?: InputProps;
  inputRightElementContent?: JSX.Element;
}

const BinaryStringInput: React.FC<Props> = ({
  title,
  inputProps,
  value,
  onChange,
  inputRightElementContent,
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const valid = isBinaryString(e.target.value);
      if (valid)
        onChange({
          status: 'success',
          input: e.target.value,
          validValue: createBinaryString(e.target.value),
        });
      else
        onChange({
          status: 'fail',
          input: e.target.value,
          message: 'This is not a binary string',
        });
    }
  };

  return (
    <FormControl isInvalid={value.status === 'fail'}>
      <InputGroup>
        {title && <InputLeftAddon>{title}</InputLeftAddon>}
        <Input value={value.input} onChange={handleOnChange} {...inputProps} />
        {inputRightElementContent && (
          <InputRightElement width="4.5rem">
            {inputRightElementContent}
          </InputRightElement>
        )}
      </InputGroup>
      {value.status === 'fail' && (
        <FormErrorMessage>{value.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default BinaryStringInput;
