import { Box } from '@chakra-ui/react';
import { Web3Context } from 'contexts/Web3Provider';
import React, { useContext, useEffect } from 'react';

const Home = () => {
  const { web3 } = useContext(Web3Context);

  useEffect(() => {
    const getData = async () => {
      const data = await web3.eth.getTransaction(
        '0xa0d5970ba77803cea4830374fd1a3e4280cddc096fd6def8e5abd17c00a3845e'
      );
      console.log(data);
    };
    getData();
  }, []);

  return <Box p="6">hello</Box>;
};

export default Home;
