import {
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import BinaryStringInput from './components/BinaryStringInput';
import { BinaryString, ValidatedInputValue } from './utils/types';
import passThroughChannel from './logic/channel';
import repeatEncode from './logic/encoding/repeatEncoding';

const App = () => {
  const [pe, setPe] = useState<ValidatedInputValue<number>>({
    status: 'success',
    input: '0.1',
    validValue: 0.1,
  });
  const handlePeChange = (valueAsString: string, valueAsNumber: number) => {
    if (isNaN(valueAsNumber))
      setPe({
        status: 'fail',
        input: valueAsString,
      });
    else
      setPe({
        status: 'success',
        input: valueAsString,
        validValue: valueAsNumber,
      });
  };

  const [m, setM] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const [y, setY] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const c = useMemo<BinaryString>(
    () => (m.status === 'success' ? repeatEncode(m.validValue, 3) : []),
    [m],
  );

  useEffect(() => {
    if (pe.status !== 'success') return;

    const newY = passThroughChannel(c, pe.validValue);
    setY({
      status: 'success',
      input: newY.reduce<string>(
        (accumulator, currentValue) => accumulator.concat(currentValue),
        '',
      ),
      validValue: newY,
    });
  }, [c, pe]);

  return (
    <Container maxW="container.md">
      <Heading py={50}>
        <Center>Encoding</Center>
      </Heading>
      <VStack align={'stretch'} spacing={4}>
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
            <FormErrorMessage>
              This probability is not a number
            </FormErrorMessage>
          )}
        </FormControl>

        <Tabs>
          <TabList>
            <Tab>Raw</Tab>
            <Tab isDisabled>Text</Tab>
            <Tab isDisabled>Image</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <VStack spacing={4}>
                <BinaryStringInput
                  value={m}
                  onChange={newValue => setM(newValue)}
                  title="m"
                />
                <InputGroup>
                  <InputLeftAddon>c</InputLeftAddon>
                  <Input
                    isReadOnly
                    value={c}
                    isDisabled={m.status === 'fail' || m.status === 'pending'}
                  />
                </InputGroup>
                <BinaryStringInput
                  value={y}
                  onChange={newValue => setY(newValue)}
                  title="y"
                  inputProps={{
                    isDisabled: m.status === 'fail' || m.status === 'pending',
                  }}
                />
                <InputGroup>
                  <InputLeftAddon>m′</InputLeftAddon>
                  <Input
                    isReadOnly
                    isDisabled={m.status === 'fail' || m.status === 'pending'}
                  />
                </InputGroup>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default App;
