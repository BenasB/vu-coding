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

  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <Container maxW="container.md">
      <Heading py={50}>
        <Center>Encoding</Center>
      </Heading>
      <VStack align={'stretch'} spacing={4}>
        <ParameterInputGroup pe={pe} setPe={setPe} n={n} setN={setN} />

        <Tabs index={tabIndex} onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab>Raw</Tab>
            <Tab>Text</Tab>
            <Tab>Image</Tab>
          </TabList>

          <ParameterInputContext.Provider value={{ pe, n }}>
            <TabPanels>
              <TabPanel px={0} key={0}>
                {tabIndex === 0 ? <RawTabPanel /> : null}
              </TabPanel>
              <TabPanel px={0} key={1}>
                {tabIndex === 1 ? <TextTabPanel /> : null}
              </TabPanel>
              <TabPanel px={0} key={2}>
                {tabIndex === 2 ? <ImageTabPanel /> : null}
              </TabPanel>
            </TabPanels>
          </ParameterInputContext.Provider>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default App;
