import { SELL_KEY } from 'constants/global';

export const ellipsis = (string, start = 6, end = 4) => {
  return `${string.substring(0, start)}...${string.substring(
    string.length - end
  )}`;
};

export const getQueryByType = (type, amount, time, lastBlock, token) => {
  if (amount === 'token') {
    return {
      query: {
        bool: {
          filter: [
            {
              term: {
                [type]: token,
              },
            },
            {
              range: {
                BlockNumber: {
                  gte: lastBlock - time,
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        total: {
          sum: {
            field: type === SELL_KEY ? 'SellAmount' : 'BuyAmount',
          },
        },
      },
    };
  }
  return {
    query: {
      bool: {
        filter: [
          {
            term: {
              [type]: token,
            },
          },
          {
            range: {
              BlockNumber: {
                gte: lastBlock - time,
              },
            },
          },
        ],
      },
    },
    size: 0,
    track_total_hits: true,
    aggs: {
      top_buyers: {
        terms: {
          field: 'CallerAddress.keyword',
        },
      },
    },
  };
};
