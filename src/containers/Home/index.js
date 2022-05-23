import { Box } from '@chakra-ui/react';
import { Web3Context } from 'contexts/Web3Provider';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { now, uniq } from 'lodash';
import axios from 'axios';

const swapEventABIInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'sender',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'amount0In',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'amount1In',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'amount0Out',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'amount1Out',
    type: 'uint256',
  },
  {
    indexed: true,
    internalType: 'address',
    name: 'to',
    type: 'address',
  },
];

const getRateABI = {
  inputs: [
    {
      internalType: 'contract IERC20',
      name: 'srcToken',
      type: 'address',
    },
    {
      internalType: 'contract IERC20',
      name: 'dstToken',
      type: 'address',
    },
    {
      internalType: 'bool',
      name: 'useWrappers',
      type: 'bool',
    },
  ],
  name: 'getRate',
  outputs: [
    {
      internalType: 'uint256',
      name: 'weightedRate',
      type: 'uint256',
    },
  ],
  stateMutability: 'view',
  type: 'function',
};

const tokenAddress = '0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b';
const usdtAddress = '0x55d398326f99059ff775485246999027b3197955';
const offChainAddress = '0xfbD61B037C325b959c0F6A7e69D8f37770C2c550';

const Home = () => {
  const { web3 } = useContext(Web3Context);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [lastBlock, setLastBlock] = useState(18061820);
  const [data, setData] = useState([]);
  const [rate, setRate] = useState(0.0);

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
      const flushData = data;
      setData([]);
      for (let i = 0; i < flushData.length; i++) {
        const row = {};
        row.caller = flushData[i].caller;
        row.amount = flushData[i].amount;
        if (row.amount < 0) {
          row.type = 'sell';
          row.amount = Math.abs(row.amount);
        } else {
          row.type = 'buy';
        }
        row.rate = rate;
        row.value = row.amount * row.rate;
        row.time = flushData[i].time;
        row.txHash = flushData[i].txHash;
        // TODO: process row
        console.log('row:', row);
      }
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

  console.log({ currentBlock, lastBlock });
  return <Box p="6">{data.length}</Box>;
};

export default Home;
