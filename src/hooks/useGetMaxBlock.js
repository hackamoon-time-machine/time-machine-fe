import { Web3Context } from 'contexts/Web3Provider';
import { useEffect, useContext, useState } from 'react';

const useGetMaxBlock = () => {
  const { web3 } = useContext(Web3Context);
  const [lastBlock, setLastBlock] = useState();

  useEffect(() => {
    const getLastBlock = async () => {
      const block = await web3.eth.getBlockNumber();
      setLastBlock(block);
    };
    getLastBlock();
  }, [web3.eth]);

  return { lastBlock };
};
export default useGetMaxBlock;
