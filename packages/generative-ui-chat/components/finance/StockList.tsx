// generative-ui-chat/components/finance/stock-list.tsx
'use client'

import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface StockListProps {
  stocks: Stock[];
  onStockSelect: (stockId: string) => void;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const formatVolume = (num: number) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const StockList: React.FC<StockListProps> = ({ stocks, onStockSelect }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  }, [stocks]);

  const pages = Math.ceil(sortedStocks.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedStocks.slice(start, end);
  }, [page, sortedStocks]);

  const renderCell = (stock: Stock, columnKey: React.Key) => {
    switch (columnKey) {
      case "symbol":
        return (
          <User
            avatarProps={{ radius: "lg", src: `/api/placeholder/32x32` }}
            description={stock.symbol}
            name={stock.name}
          >
            {stock.name}
          </User>
        );
      case "price":
        return <div>${formatNumber(stock.price)}</div>;
      case "change":
        return (
          <div className={stock.change >= 0 ? "text-success" : "text-danger"}>
            ${formatNumber(Math.abs(stock.change))}
          </div>
        );
      case "changePercent":
        return (
          <Chip
            color={stock.changePercent >= 0 ? "success" : "danger"}
            variant="flat"
            startContent={stock.changePercent >= 0 ? <Icon icon="mdi:trending-up" /> : <Icon icon="mdi:trending-down" />}
          >
            {formatNumber(Math.abs(stock.changePercent))}%
          </Chip>
        );
      case "volume":
        return <div>{formatVolume(stock.volume)}</div>;
      default:
        return <div>N/A</div>;
    }
  };

  return (
    <div className="w-full">
      <Table
        aria-label="Stock list table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn key="symbol">STOCK</TableColumn>
          <TableColumn key="price">PRICE</TableColumn>
          <TableColumn key="change">CHANGE</TableColumn>
          <TableColumn key="changePercent">% CHANGE</TableColumn>
          <TableColumn key="volume">VOLUME</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id} onClick={() => onStockSelect(item.id)}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const StockListExample = () => {
  const exampleStocks: Stock[] = [
    { id: "1", symbol: "AAPL", name: "Apple Inc.", price: 150.25, change: 2.75, changePercent: 1.86, volume: 75000000 },
    { id: "2", symbol: "GOOGL", name: "Alphabet Inc.", price: 2800.50, change: -15.30, changePercent: -0.54, volume: 1500000 },
    { id: "3", symbol: "MSFT", name: "Microsoft Corporation", price: 305.75, change: 1.25, changePercent: 0.41, volume: 25000000 },
    { id: "4", symbol: "AMZN", name: "Amazon.com, Inc.", price: 3300.00, change: -25.50, changePercent: -0.77, volume: 3500000 },
    { id: "5", symbol: "FB", name: "Meta Platforms, Inc.", price: 325.45, change: 5.20, changePercent: 1.62, volume: 18000000 },
    // Add more stocks as needed to demonstrate pagination
  ];

  const handleStockSelect = (stockId: string) => {
    console.log(`Selected stock with ID: ${stockId}`);
    // Here you would typically navigate to a detailed view of the selected stock
  };

  return <StockList stocks={exampleStocks} onStockSelect={handleStockSelect} />;
};