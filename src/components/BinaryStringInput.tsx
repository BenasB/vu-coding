import {
  InputGroup,
  InputLeftAddon,
  Input,
  InputProps,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import React from 'react';
import { BinaryString, ValidatedInputValue } from '../utils/types';

interface Props {
  value: ValidatedInputValue<BinaryString>;
  onChange?: (newValue: ValidatedInputValue<BinaryString>) => void;
  title?: string | JSX.Element;
  inputProps?: InputProps;
}

const BinaryStringInput: React.FC<Props> = ({
  title,
  inputProps,
  value,
  onChange,
}) => {
  const regex = /^[01]+$/;
  const validate = (value: string) => regex.test(value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const valid = validate(e.target.value);
      if (valid)
        onChange({
          status: 'success',
          input: e.target.value,
          validValue: [...e.target.value].map(x => (x === '0' ? '0' : '1')),
        });
      else
        onChange({
          status: 'fail',
          input: e.target.value,
        });
    }
  };

  return (
    <FormControl isInvalid={value.status === 'fail'}>
      <InputGroup>
        {title && <InputLeftAddon>{title}</InputLeftAddon>}
        <Input value={value.input} onChange={handleOnChange} {...inputProps} />
      </InputGroup>
      {value.status === 'fail' && (
        <FormErrorMessage>This is not a binary string</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default BinaryStringInput;
