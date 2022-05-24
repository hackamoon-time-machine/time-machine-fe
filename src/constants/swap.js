export const SWAP_EVENT_ABI_INPUTS = [
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

export const RATE_ABI = {
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

export const TOKEN_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
export const USDT_ADDRESS = '0x55d398326f99059ff775485246999027b3197955';
export const OFF_CHAIN_ADDRESS = '0xfbD61B037C325b959c0F6A7e69D8f37770C2c550';

export const SELL = 'Sell';
export const BUY = 'Buy';
