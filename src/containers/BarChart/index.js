import React from 'react';

import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarGroupChart = ({ data: dataBar, type }) => {
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {},
      },
      y: {
        stacked: true,
        grid: {
          color: '#41596C',
          drawBorder: true,
          drawOnChartArea: true,
        },
        ticks: {
          count: 6,
        },
        pointLabels: {
          color: '#fff',
        },
      },
    },
  };

  const labels =
    dataBar?.sellData.map(e => `${e.min.value}-${e.max.value}`) || [];

  const data = {
    labels,
    datasets: [
      {
        label: 'Buy',
        data:
          type === 'token'
            ? dataBar.buyData.map(e => e.sum.value)
            : dataBar.buyData.map(e => e.doc_count),
        backgroundColor: '#FF6E40',
        stack: 'Stack 1',
      },
      {
        label: 'Sell',
        data:
          type === 'token'
            ? dataBar.sellData.map(e => e.sum.value)
            : dataBar.sellData.map(e => e.doc_count),
        backgroundColor: '#1DE9B6',
        stack: 'Stack 0',
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarGroupChart;
