import {
  Center,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ValidatedInputValue } from './utils/types';
import ParameterInputGroup from './components/ParameterInputGroup';
import RawTabPanel from './components/tabs/RawTabPanel';
import ParameterInputContext, {
  parameterInputContextPropsInitial,
} from './state/ParameterInputContext';
import TextTabPanel from './components/tabs/TextTabPanel';
import ImageTabPanel from './components/tabs/ImageTabPanel';

const App = () => {
  const [pe, setPe] = useState<ValidatedInputValue<number>>(
    parameterInputContextPropsInitial.pe,
  );

  const [n, setN] = useState<ValidatedInputValue<number>>(
    parameterInputContextPropsInitial.n,
  );

  return (
    <Container maxW="container.md">
      <Heading py={50}>
        <Center>Encoding</Center>
      </Heading>
      <VStack align={'stretch'} spacing={4}>
        <ParameterInputGroup pe={pe} setPe={setPe} n={n} setN={setN} />

        <Tabs>
          <TabList>
            <Tab>Raw</Tab>
            <Tab>Text</Tab>
            <Tab>Image</Tab>
          </TabList>

          <ParameterInputContext.Provider value={{ pe, n }}>
            <TabPanels>
              <TabPanel px={0}>
                <RawTabPanel />
              </TabPanel>
              <TabPanel px={0}>
                <TextTabPanel />
              </TabPanel>
              <TabPanel px={0}>
                <ImageTabPanel />
              </TabPanel>
            </TabPanels>
          </ParameterInputContext.Provider>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default App;
