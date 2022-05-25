import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import WrapperRoute from 'router';
import Web3Provider from 'contexts/Web3Provider';
import TradesProvider from 'contexts/Trades';
import theme from './theme';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <TradesProvider>
          <Web3Provider>
            <WrapperRoute />
          </Web3Provider>
        </TradesProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
