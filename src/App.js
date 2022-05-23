import React from 'react';

import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import WrapperRoute from 'router';
import Web3Provider from 'contexts/Web3Provider';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Web3Provider>
          <WrapperRoute />
        </Web3Provider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
