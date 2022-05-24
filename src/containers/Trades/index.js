import { Box, Heading } from '@chakra-ui/react';
import { Web3Context } from 'contexts/Web3Provider';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  SWAP_EVENT_ABI_INPUTS,
  RATE_ABI,
  TOKEN_ADDRESS,
  USDT_ADDRESS,
  OFF_CHAIN_ADDRESS,
  BUY,
  SELL,
} from 'constants/swap';
import TableWrapper from 'components/Table';
import { unionBy, uniq } from 'lodash';

const Trades = () => {
  const { web3 } = useContext(Web3Context);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [lastBlock, setLastBlock] = useState(18077054);
  const [data, setData] = useState([]);
  const [rate, setRate] = useState(0.0);
  const [dataFormat, setDataFormat] = useState([]);

  const handleLogs = useCallback(
    logs => {
      const swapEvents = [];
      const pools = [];
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        const topics = log.topics.slice(1, 3);
        const data = log.data;
        const swapEvent = web3.eth.abi.decodeLog(
          SWAP_EVENT_ABI_INPUTS,
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
        uniq(pools).join(',');

      axios.get(url).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          const pool = res.data[i];
          const poolAddress = pool.address;
          for (let j = 0; j < swapEvents.length; j++) {
            const swapEvent = swapEvents[j];
            if (swapEvent.address.toLowerCase() === poolAddress.toLowerCase()) {
              if (
                pool.token0.address.toLowerCase() ===
                TOKEN_ADDRESS.toLowerCase()
              ) {
                let newRow = {
                  amount:
                    (swapEvent.amount0Out - swapEvent.amount0In) /
                    Math.pow(10, pool.token0.decimals),
                  caller: swapEvent.sender,
                  time: Date().toLocaleString(),
                  txHash: swapEvent.transactionHash,
                };

                const updatedData = [...data, newRow];
                setData(updatedData);
              }
              if (
                pool.token1.address.toLowerCase() ===
                TOKEN_ADDRESS.toLowerCase()
              ) {
                let newRow = {
                  amount:
                    (swapEvent.amount1Out - swapEvent.amount1In) /
                    Math.pow(10, pool.token1.decimals),
                  caller: swapEvent.sender,
                  time: Date().toLocaleString(),
                  txHash: swapEvent.transactionHash,
                };

                const updatedData = [...data, newRow];
                setData(updatedData);
              }
            }
          }
        }
      });
    },
    [data, web3.eth.abi]
  );

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
          value: Math.abs(e.amount) * rate,
          type: e.amount < 0 ? SELL : BUY,
        };
      });

      setDataFormat(prev => unionBy([...newFormatData, ...prev], 'txHash'));
    };

    fetchData();
  }, [currentBlock, data, handleLogs, lastBlock, rate, web3.eth]);

  useEffect(() => {
    const getLastBlock = async () => {
      const block = await web3.eth.getBlockNumber();
      setCurrentBlock(block);
    };

    const getRate = async () => {
      const callData = web3.eth.abi.encodeFunctionCall(RATE_ABI, [
        TOKEN_ADDRESS,
        USDT_ADDRESS,
        false,
      ]);
      const result = await web3.eth.call({
        to: OFF_CHAIN_ADDRESS,
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

  console.log({ dataFormat });
  return (
    <Box p="6" bg="dark.400" borderRadius="12px">
      <Heading as="h4" mb={4} color="white.200">
        TRADE HISTORY
      </Heading>
      <TableWrapper data={dataFormat} />
    </Box>
  );
};

export default Trades;