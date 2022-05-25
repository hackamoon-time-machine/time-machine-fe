import React, { useState, useCallback, useEffect } from 'react';
import { TOKEN_ADDRESS } from 'constants/swap';
import axios from 'axios';

export const TradesContext = React.createContext({
  token: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  infoToken: {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    name: 'Kyber Network Crystal',
    decimals: 18,
    symbol: 'KNC',
  },
  setToken: () => {},
  handleGetInfo: () => {},
});

const TradesProvider = ({ children }) => {
  const [token, setToken] = useState(TOKEN_ADDRESS);
  const [infoToken, setInfoToken] = useState({});

  const handleGetInfo = useCallback(() => {
    axios
      .get(
        `https://contract-info-dev.krystal.team/token?addresses=${token}&networks=bsc`
      )
      .then(res => {
        setInfoToken(res.data[0]);
      })
      .catch(err => console.log({ err }));
  }, [token]);

  useEffect(() => {
    handleGetInfo();
  }, [handleGetInfo]);

  return (
    <TradesContext.Provider
      value={{ infoToken, token, setToken, handleGetInfo }}
    >
      {children}
    </TradesContext.Provider>
  );
};

export default TradesProvider;
