import { Box } from '@chakra-ui/react';
import { Web3Context } from 'contexts/Web3Provider';
import React, { useContext, useEffect, useState } from 'react';
import { now } from 'lodash';
import axios from 'axios';
import {
  swapEventABIInputs,
  getRateABI,
  tokenAddress,
  usdtAddress,
  offChainAddress,
} from 'constants/swap';

const Home = () => {
  const { web3 } = useContext(Web3Context);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [lastBlock, setLastBlock] = useState(18068559);
  const [data, setData] = useState([]);
  const [rate, setRate] = useState(0.0);
  const [dataFormat, setDataFormat] = useState([]);

  useEffect(() => {
    if (currentBlock < lastBlock) {
      return;
    }
    const fetchData = async () => {
      const pastLogs = await web3.eth.getPastLogs({
        fromBlock: lastBlock,
        toBlock: currentBlock,
        topics: [
          [
            web3.eth.abi.encodeEventSignature(
              'Swap(address,uint256,uint256,uint256,uint256,address)'
            ),
          ],
        ],
      });

      setLastBlock(currentBlock + 1);
      handleLogs(pastLogs);
      const flushData = [...data];
      setData([]);

      const newFormatData = flushData.map(e => {
        return {
          caller: e.caller,
          amount: Math.abs(e.amount),
          rate: rate,
          time: e.time,
          txHash: e.txHash,
          value: e.amount * rate,
          type: e.amount < 0 ? 'sell' : 'buy',
        };
      });

      setDataFormat(prev => [...prev, ...newFormatData]);
    };

    fetchData();
  }, [currentBlock, lastBlock, web3]);

  useEffect(() => {
    const getLastBlock = async () => {
      const block = await web3.eth.getBlockNumber();
      setCurrentBlock(block);
    };

    const getRate = async () => {
      const callData = web3.eth.abi.encodeFunctionCall(getRateABI, [
        tokenAddress,
        usdtAddress,
        false,
      ]);
      const result = await web3.eth.call({
        to: offChainAddress,
        data: callData,
      });
      const weightedRate = web3.eth.abi.decodeParameter('uint256', result);
      setRate(weightedRate / 1e18);
    };

    const intervalGetBlock = setInterval(() => {
      getLastBlock();
      getRate();
    }, 1000);

    return () => {
      clearInterval(intervalGetBlock);
    };
  }, [web3]);

  function handleLogs(logs) {
    const swapEvents = [];
    const pools = [];
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      const topics = log.topics.slice(1, 3);
      const data = log.data;
      const swapEvent = web3.eth.abi.decodeLog(
        swapEventABIInputs,
        data,
        topics
      );
      swapEvent.address = log.address;
      pools.push(log.address);
      swapEvent.transactionHash = log.transactionHash;
      swapEvents.push(swapEvent);
    }
    const url =
      'https://contract-info-dev.krystal.team/pool/bsc?addresses=' +
      pools.join(',');

    axios.get(url).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        const pool = res.data[i];
        const poolAddress = pool.address;
        for (let j = 0; j < swapEvents.length; j++) {
          const swapEvent = swapEvents[j];
          if (swapEvent.address.toLowerCase() === poolAddress.toLowerCase()) {
            const row = {};
            if (
              pool.token0.address.toLowerCase() === tokenAddress.toLowerCase()
            ) {
              row.amount =
                (swapEvent.amount0Out - swapEvent.amount0In) /
                Math.pow(10, pool.token0.decimals);
              row.caller = swapEvent.sender;
              row.time = now();
              row.txHash = swapEvent.transactionHash;
              const updatedData = [...data, row];
              setData(updatedData);
            }
            if (
              pool.token1.address.toLowerCase() === tokenAddress.toLowerCase()
            ) {
              row.amount =
                (swapEvent.amount1Out - swapEvent.amount1In) /
                Math.pow(10, pool.token1.decimals);
              row.caller = swapEvent.sender;
              row.time = Date().toLocaleString();
              row.txHash = swapEvent.transactionHash;
              const updatedData = [...data, row];
              setData(updatedData);
            }
          }
        }
      }
    });
  }

  return <Box p="6">{dataFormat.length}</Box>;
};

export default Home;
