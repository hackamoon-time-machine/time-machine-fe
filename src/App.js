import React from 'react';

import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import WrapperRoute from 'router';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <WrapperRoute />
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
