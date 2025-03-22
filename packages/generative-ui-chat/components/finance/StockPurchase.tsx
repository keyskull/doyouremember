// generative-ui-chat/components/finance/stock-purchase.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Slider, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StockPurchaseProps {
    symbol: string;
    companyName: string;
    currentPrice: number;
    onPurchase: (shares: number, totalCost: number) => void;
}

export const StockPurchase: React.FC<StockPurchaseProps> = ({
    symbol,
    companyName,
    currentPrice,
    onPurchase
}) => {
    const [shares, setShares] = useState<number>(1);
    const [totalCost, setTotalCost] = useState<number>(currentPrice);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setTotalCost(Number((shares * currentPrice).toFixed(2)));
    }, [shares, currentPrice]);

    const handleSharesChange = (value: number | number[]) => {
        const newShares = Array.isArray(value) ? value[0] : value;
        setShares(newShares);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setShares(isNaN(value) ? 1 : Math.max(1, value));
    };

    const handlePurchase = async () => {
        setIsLoading(true);
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        onPurchase(shares, totalCost);
        setIsLoading(false);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-col items-start">
                <h2 className="text-2xl font-bold">Purchase {symbol} Stock</h2>
                <p className="text-sm text-gray-500">{companyName}</p>
            </CardHeader>
            <CardBody className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="current-price">Current Price</label>
                    <Input
                        id="current-price"
                        value={`$${currentPrice.toFixed(2)}`}
                        readOnly
                        startContent={<Icon icon="mdi:currency-usd" />}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="shares">Number of Shares</label>
                    <Slider 
                        aria-label="Shares"
                        step={1}
                        maxValue={100}
                        minValue={1}
                        value={shares}
                        onChange={handleSharesChange}
                        className="max-w-md"
                    />
                    <Input
                        id="shares"
                        type="number"
                        min="1"
                        value={shares.toString()}
                        onChange={handleInputChange}
                        startContent={<Icon icon="mdi:chart-line" />}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="total-cost">Total Cost</label>
                    <Input
                        id="total-cost"
                        value={`$${totalCost.toFixed(2)}`}
                        readOnly
                        startContent={<Icon icon="mdi:calculator" />}
                    />
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Purchase Summary</h3>
                    <p>You are about to purchase {shares} shares of {symbol} at ${currentPrice.toFixed(2)} per share.</p>
                    <p className="font-bold mt-2">Total Cost: ${totalCost.toFixed(2)}</p>
                </div>
            </CardBody>
            <CardFooter>
                <Button
                    className="w-full"
                    color="primary"
                    onClick={handlePurchase}
                    disabled={shares <= 0 || isLoading}
                >
                    {isLoading ? (
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className="max-w-md"
                        />
                    ) : (
                        <>
                            <Icon icon="mdi:cart" className="mr-2" />
                            Purchase Shares
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export const StockPurchaseExample = () => {
    const handlePurchase = (shares: number, totalCost: number) => {
        console.log(`Purchased ${shares} shares for a total of $${totalCost.toFixed(2)}`);
        // Here you would typically send this data to your backend or state management system
    };

    return (
        <StockPurchase
            symbol="AAPL"
            companyName="Apple Inc."
            currentPrice={150.25}
            onPurchase={handlePurchase}
        />
    );
};