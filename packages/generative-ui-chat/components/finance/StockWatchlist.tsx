// generative-ui-chat/components/finance/stock-watchlist.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface WatchlistStock {
    id: string;
    symbol: string;
    companyName: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    volume: number;
}

interface StockWatchlistProps {
    stocks: WatchlistStock[];
    onAddStock: (symbol: string) => Promise<void>;
    onRemoveStock: (id: string) => void;
    onRefresh: () => Promise<void>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

const formatPercentage = (percentage: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(percentage / 100);
};

const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(volume);
};

export const StockWatchlist: React.FC<StockWatchlistProps> = ({
    stocks,
    onAddStock,
    onRemoveStock,
    onRefresh
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newStockSymbol, setNewStockSymbol] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleAddStock = async () => {
        if (newStockSymbol) {
            await onAddStock(newStockSymbol);
            setNewStockSymbol('');
            onClose();
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
    };

    const renderChangeChip = (change: number, changePercent: number) => {
        const isPositive = change >= 0;
        const color = isPositive ? "success" : "danger";
        const icon = isPositive ? "mdi:trending-up" : "mdi:trending-down";
        
        return (
            <Chip
                color={color}
                variant="flat"
                startContent={<Icon icon={icon} />}
            >
                {formatCurrency(Math.abs(change))} ({formatPercentage(Math.abs(changePercent))})
            </Chip>
        );
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Stock Watchlist</h2>
                <div className="flex gap-2">
                    <Button color="primary" onPress={onOpen}>Add Stock</Button>
                    <Button 
                        isIconOnly 
                        color="primary" 
                        variant="light" 
                        onPress={handleRefresh}
                        isLoading={isRefreshing}
                    >
                        <Icon icon="mdi:refresh" />
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                <Table aria-label="Stock watchlist">
                    <TableHeader>
                        <TableColumn>STOCK</TableColumn>
                        <TableColumn>PRICE</TableColumn>
                        <TableColumn>CHANGE</TableColumn>
                        <TableColumn>VOLUME</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {stocks.map((stock) => (
                            <TableRow key={stock.id}>
                                <TableCell>
                                    <User
                                        name={stock.symbol}
                                        description={stock.companyName}
                                        avatarProps={{
                                            src: `/api/placeholder/50x50`
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{formatCurrency(stock.currentPrice)}</TableCell>
                                <TableCell>
                                    {renderChangeChip(stock.change, stock.changePercent)}
                                </TableCell>
                                <TableCell>{formatVolume(stock.volume)}</TableCell>
                                <TableCell>
                                    <Button 
                                        isIconOnly 
                                        color="danger" 
                                        variant="light" 
                                        onPress={() => onRemoveStock(stock.id)}
                                    >
                                        <Icon icon="mdi:delete" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardBody>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Add Stock to Watchlist</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Stock Symbol"
                            placeholder="Enter stock symbol (e.g., AAPL)"
                            value={newStockSymbol}
                            onChange={(e) => setNewStockSymbol(e.target.value.toUpperCase())}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleAddStock}>
                            Add Stock
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export const StockWatchlistExample = () => {
    const [stocks, setStocks] = useState<WatchlistStock[]>([
        { id: '1', symbol: 'AAPL', companyName: 'Apple Inc.', currentPrice: 150.25, change: 2.75, changePercent: 1.86, volume: 75000000 },
        { id: '2', symbol: 'GOOGL', companyName: 'Alphabet Inc.', currentPrice: 2800.50, change: -15.30, changePercent: -0.54, volume: 1500000 },
        { id: '3', symbol: 'MSFT', companyName: 'Microsoft Corporation', currentPrice: 305.75, change: 1.25, changePercent: 0.41, volume: 25000000 },
    ]);

    const handleAddStock = async (symbol: string) => {
        // In a real application, you would fetch the stock data from an API
        const newStock: WatchlistStock = {
            id: (stocks.length + 1).toString(),
            symbol,
            companyName: `${symbol} Company`,
            currentPrice: 100 + Math.random() * 900,
            change: Math.random() * 10 - 5,
            changePercent: Math.random() * 5 - 2.5,
            volume: Math.floor(Math.random() * 10000000)
        };
        setStocks([...stocks, newStock]);
    };

    const handleRemoveStock = (id: string) => {
        setStocks(stocks.filter(stock => stock.id !== id));
    };

    const handleRefresh = async () => {
        // In a real application, you would fetch updated data for all stocks
        setStocks(stocks.map(stock => ({
            ...stock,
            currentPrice: stock.currentPrice + (Math.random() * 10 - 5),
            change: Math.random() * 10 - 5,
            changePercent: Math.random() * 5 - 2.5,
            volume: Math.floor(Math.random() * 10000000)
        })));
    };

    return (
        <StockWatchlist
            stocks={stocks}
            onAddStock={handleAddStock}
            onRemoveStock={handleRemoveStock}
            onRefresh={handleRefresh}
        />
    );
};