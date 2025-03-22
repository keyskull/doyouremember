// generative-ui-chat/components/finance/stock-portfolio.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Button, Tooltip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StockHolding {
    id: string;
    symbol: string;
    companyName: string;
    shares: number;
    averageCost: number;
    currentPrice: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercentage: number;
}

interface StockPortfolioProps {
    holdings: StockHolding[];
    totalValue: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
    onRefresh: () => void;
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

export const StockPortfolio: React.FC<StockPortfolioProps> = ({
    holdings,
    totalValue,
    totalGainLoss,
    totalGainLossPercentage,
    onRefresh
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
    };

    const renderGainLoss = (value: number, percentage: number) => {
        const isPositive = value >= 0;
        const color = isPositive ? "success" : "danger";
        const icon = isPositive ? "mdi:trending-up" : "mdi:trending-down";
        
        return (
            <Chip
                color={color}
                variant="flat"
                startContent={<Icon icon={icon} />}
            >
                {formatCurrency(Math.abs(value))} ({formatPercentage(Math.abs(percentage))})
            </Chip>
        );
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Stock Portfolio</h2>
                    <p className="text-sm text-gray-500">Total Value: {formatCurrency(totalValue)}</p>
                </div>
                <div className="flex items-center">
                    {renderGainLoss(totalGainLoss, totalGainLossPercentage)}
                    <Tooltip content="Refresh Portfolio">
                        <Button
                            isIconOnly
                            color="primary"
                            variant="light"
                            onPress={handleRefresh}
                            isLoading={isRefreshing}
                        >
                            <Icon icon="mdi:refresh" />
                        </Button>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardBody>
                <Table aria-label="Stock portfolio holdings">
                    <TableHeader>
                        <TableColumn>STOCK</TableColumn>
                        <TableColumn>SHARES</TableColumn>
                        <TableColumn>AVG COST</TableColumn>
                        <TableColumn>CURRENT PRICE</TableColumn>
                        <TableColumn>TOTAL VALUE</TableColumn>
                        <TableColumn>GAIN/LOSS</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {holdings.map((holding) => (
                            <TableRow key={holding.id}>
                                <TableCell>
                                    <User
                                        name={holding.symbol}
                                        description={holding.companyName}
                                        avatarProps={{
                                            src: `/api/placeholder/50x50`
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{holding.shares}</TableCell>
                                <TableCell>{formatCurrency(holding.averageCost)}</TableCell>
                                <TableCell>{formatCurrency(holding.currentPrice)}</TableCell>
                                <TableCell>{formatCurrency(holding.totalValue)}</TableCell>
                                <TableCell>
                                    {renderGainLoss(holding.gainLoss, holding.gainLossPercentage)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
};

export const StockPortfolioExample = () => {
    const exampleHoldings: StockHolding[] = [
        {
            id: '1',
            symbol: 'AAPL',
            companyName: 'Apple Inc.',
            shares: 10,
            averageCost: 150,
            currentPrice: 175,
            totalValue: 1750,
            gainLoss: 250,
            gainLossPercentage: 16.67
        },
        {
            id: '2',
            symbol: 'GOOGL',
            companyName: 'Alphabet Inc.',
            shares: 5,
            averageCost: 2000,
            currentPrice: 1950,
            totalValue: 9750,
            gainLoss: -250,
            gainLossPercentage: -2.5
        },
        {
            id: '3',
            symbol: 'MSFT',
            companyName: 'Microsoft Corporation',
            shares: 15,
            averageCost: 200,
            currentPrice: 220,
            totalValue: 3300,
            gainLoss: 300,
            gainLossPercentage: 10
        }
    ];

    const totalValue = exampleHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
    const totalGainLoss = exampleHoldings.reduce((sum, holding) => sum + holding.gainLoss, 0);
    const totalGainLossPercentage = (totalGainLoss / (totalValue - totalGainLoss)) * 100;

    const handleRefresh = async () => {
        console.log('Refreshing portfolio...');
        // Here you would typically fetch updated stock data and recalculate the portfolio
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
    };

    return (
        <StockPortfolio
            holdings={exampleHoldings}
            totalValue={totalValue}
            totalGainLoss={totalGainLoss}
            totalGainLossPercentage={totalGainLossPercentage}
            onRefresh={handleRefresh}
        />
    );
};