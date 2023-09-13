import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import BaseTabPanel from './BaseTabPanel';
import { ValidatedInputValue, BinaryString } from '../../utils/types';

const ImageTabPanel: React.FC = () => {
  const [imageInput, setImageInput] = useState<File | undefined>(undefined);
  const handleOnImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    setImageInput(file ?? undefined);
  };

  const [mPrime, setMPrime] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const tempM = useMemo<ValidatedInputValue<BinaryString>>(
    () => ({
      status: 'pending',
      input: '',
    }),
    [],
  );

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup>
          <InputLeftAddon>Input</InputLeftAddon>
          <Input
            type="file"
            accept="image/*"
            onChange={handleOnImageInputChange}
            sx={{
              '::file-selector-button': {
                display: 'none',
              },
            }}
            lineHeight={'35px'}
          />
        </InputGroup>
      </FormControl>
      <BaseTabPanel m={tempM} mPrime={mPrime} setMPrime={setMPrime} />
    </VStack>
  );
};

export default ImageTabPanel;
