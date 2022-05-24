export const swapEventABIInputs = [
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

export const getRateABI = {
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

export const tokenAddress = '0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b';
export const usdtAddress = '0x55d398326f99059ff775485246999027b3197955';
export const offChainAddress = '0xfbD61B037C325b959c0F6A7e69D8f37770C2c550';
