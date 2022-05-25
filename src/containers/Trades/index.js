import { Box, Heading } from '@chakra-ui/react';
import { Web3Context } from 'contexts/Web3Provider';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  SWAP_EVENT_ABI_INPUTS,
  RATE_ABI,
  USDT_ADDRESS,
  OFF_CHAIN_ADDRESS,
  BUY,
  SELL,
} from 'constants/swap';
import TableWrapper from 'components/Table';
import { uniq, uniqBy } from 'lodash';
import { TradesContext } from 'contexts/Trades';

const Trades = ({ heightCustom, initLastBlock }) => {
  const { web3 } = useContext(Web3Context);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [lastBlock, setLastBlock] = useState(initLastBlock);
  const [rate, setRate] = useState(0.0);
  const [dataFormat, setDataFormat] = useState([]);
  const { token } = useContext(TradesContext);

  const handleLogs = useCallback(
    logs => {
      try {
        // get pools, swapEvents
        const pools = logs.map(log => log.address);
        const swapEvents = logs.map(log => {
          const swapEvent = web3.eth.abi.decodeLog(
            SWAP_EVENT_ABI_INPUTS,
            log.data,
            log.topics.slice(1, 3)
          );

          return {
            address: log.address,
            transactionHash: log.transactionHash,
            uniqKey: `${log.transactionHash}-${log.logIndex}`,
            ...swapEvent,
          };
        });

        const url =
          'https://contract-info-dev.krystal.team/pool/bsc?addresses=' +
          uniq(pools).join(',');

        axios.get(url).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            const pool = res.data[i];
            const poolAddress = pool.address;
            for (let j = 0; j < swapEvents.length; j++) {
              const swapEvent = swapEvents[j];
              if (
                swapEvent.address.toLowerCase() === poolAddress.toLowerCase()
              ) {
                if (
                  pool.token0.address.toLowerCase() === token.toLowerCase() ||
                  pool.token1.address.toLowerCase() === token.toLowerCase()
                ) {
                  let matchToken =
                    pool.token0.address.toLowerCase() === token.toLowerCase()
                      ? pool.token0
                      : pool.token1;
                  web3.eth
                    .getTransaction(swapEvent.transactionHash)
                    .then(tx => {
                      let newAmount =
                        (swapEvent.amount1Out - swapEvent.amount1In) /
                        Math.pow(10, matchToken.decimals);

                      let newRow = {
                        amount: Math.abs(newAmount),
                        value: Math.abs(newAmount) * rate,
                        type: newAmount < 0 ? SELL : BUY,
                        caller: tx.from,
                        time: Date().toLocaleString(),
                        txHash: swapEvent.transactionHash,
                        uniqKey: swapEvent.uniqKey,
                        rate,
                      };

                      // const updatedData = [newRow, ...data];
                      setDataFormat(prev =>
                        uniqBy([newRow, ...prev], 'uniqKey')
                      );
                    })
                    .catch(err => console.log('catch', err));
                }
              }
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rate, web3.eth]
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
      handleLogs(pastLogs);
    };
    fetchData();

    setLastBlock(currentBlock + 1);
  }, [currentBlock, handleLogs, lastBlock, web3.eth]);

  useEffect(() => {
    const getLastBlock = async () => {
      const block = await web3.eth.getBlockNumber();
      setCurrentBlock(block);
    };

    const getRate = async () => {
      const callData = web3.eth.abi.encodeFunctionCall(RATE_ABI, [
        token,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  //refresh data when change token
  useEffect(() => {
    setDataFormat([]);
  }, [token]);

  return (
    <Box p="6" bg="dark.400" borderRadius="12px">
      <Heading as="h4" mb={4} color="white.200">
        TRADE HISTORY
      </Heading>
      <TableWrapper data={dataFormat} heightCustom={heightCustom} />
    </Box>
  );
};

export default Trades;
