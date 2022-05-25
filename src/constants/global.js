// export const PROVIDER_URL = 'https://bsc-dataseed.binance.org/';
export const PROVIDER_URL = 'https://neproxy-dev.krystal.team/neproxy/bsc';

export const OPTION_AMOUNT = [
  {
    label: 'TXMS',
    value: 'tmxs',
  },
  // {
  //   label: 'Amount in USD',
  //   value: 'usd',
  // },
  {
    label: 'Amount in Token',
    value: 'token',
  },
];

export const OPTION_TIME = [
  {
    label: 'Last 1 hours',
    value: 20 * 60,
  },
  {
    label: 'Last 1 days',
    value: 20 * 60 * 24,
  },
  {
    label: 'Last 7 days',
    value: 20 * 60 * 24 * 7,
  },
];

export const SELL_KEY = 'BuyAddress.keyword';
export const BUY_KEY = 'SellAddress.keyword';
