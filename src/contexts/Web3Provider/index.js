import React from 'react';
import Web3 from 'web3';

export const Web3Context = React.createContext();

const Web3Provider = ({ children }) => {
  const web3 = new Web3('https://bsc-dataseed.binance.org/');

  return (
    <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>
  );
};

export default Web3Provider;
