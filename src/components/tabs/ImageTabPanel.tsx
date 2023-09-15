import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import BaseTabPanel from './BaseTabPanel';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import { readFileAsArrayBuffer } from '../../utils/file-utils';
import {
  arrayBufferToBinaryString,
  binaryStringToString,
} from '../../utils/type-utils';

const ImageTabPanel: React.FC = () => {
  const [imageInput, setImageInput] = useState<File | undefined>(undefined);
  const handleOnImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    setImageInput(file ?? undefined);
  };

  const [m, setM] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  useEffect(() => {
    const startImageLoad = async () => {
      if (imageInput === undefined) return;
      setM({
        status: 'pending',
        input: '',
      });
      console.log('sbefore await');
      const arrayBuffer = await readFileAsArrayBuffer(imageInput);
      console.log('after await', arrayBuffer);
      if (!ignore) {
        console.log('before to binarystring');
        const binaryString = arrayBufferToBinaryString(arrayBuffer, 8);
        console.log('setting result success');
        setM({
          status: 'success',
          input: binaryStringToString(binaryString),
          validValue: binaryString,
        });
      }
    };

    let ignore = false;
    startImageLoad();
    return () => {
      ignore = true;
    };
  }, [imageInput]);

  const [mPrime, setMPrime] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

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
      <BaseTabPanel m={m} mPrime={mPrime} setMPrime={setMPrime} />
    </VStack>
  );
};

export default ImageTabPanel;
