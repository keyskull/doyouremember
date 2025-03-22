// generative-ui-chat/components/finance/stock-chart.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockData {
  date: string;
  price: number;
}

interface StockChartProps {
  symbol: string;
  companyName: string;
  data: StockData[];
}

const timeRanges = [
  { key: '1W', label: '1 Week' },
  { key: '1M', label: '1 Month' },
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
  { key: '1Y', label: '1 Year' },
  { key: '5Y', label: '5 Years' },
];

export const StockChart: React.FC<StockChartProps> = ({ symbol, companyName, data }) => {
  const [timeRange, setTimeRange] = useState('1M');

  const filterData = (range: string) => {
    const now = new Date();
    let startDate = new Date();
    switch (range) {
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case '5Y':
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        startDate = new Date(0); // Show all data
    }
    return data.filter(item => new Date(item.date) >= startDate);
  };

  const chartData = filterData(timeRange);

  const formatYAxis = (value: number) => `$${value.toFixed(2)}`;

  const formatTooltip = (value: number, name: string) => [`$${value.toFixed(2)}`, 'Price'];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{symbol} Stock Price</h2>
          <p className="text-small text-default-500">{companyName}</p>
        </div>
        <Select
          label="Time Range"
          selectedKeys={[timeRange]}
          className="max-w-xs"
          onChange={(e) => setTimeRange(e.target.value)}
        >
          {timeRanges.map((range) => (
            <SelectItem key={range.key}>
              {range.label}
            </SelectItem>
          ))}
        </Select>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip formatter={formatTooltip} />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export const StockChartExample = () => {
  const exampleData: StockData[] = [
    { date: '2023-01-01', price: 150.00 },
    { date: '2023-02-01', price: 155.50 },
    { date: '2023-03-01', price: 160.25 },
    { date: '2023-04-01', price: 158.75 },
    { date: '2023-05-01', price: 162.00 },
    { date: '2023-06-01', price: 165.50 },
    { date: '2023-07-01', price: 170.25 },
    { date: '2023-08-01', price: 168.75 },
    { date: '2023-09-01', price: 172.00 },
    { date: '2023-10-01', price: 175.50 },
    { date: '2023-11-01', price: 180.25 },
    { date: '2023-12-01', price: 178.75 },
    { date: '2024-01-01', price: 182.00 },
  ];

  return (
    <StockChart
      symbol="AAPL"
      companyName="Apple Inc."
      data={exampleData}
    />
  );
};