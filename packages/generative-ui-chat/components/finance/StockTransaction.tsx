// generative-ui-chat/components/finance/stock-transaction.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, RadioGroup, Radio, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StockTransactionProps {
    symbol: string;
    companyName: string;
    currentPrice: number;
    availableCash: number;
    onExecuteTransaction: (transactionDetails: TransactionDetails) => Promise<void>;
}

interface TransactionDetails {
    symbol: string;
    transactionType: 'buy' | 'sell';
    orderType: 'market' | 'limit';
    quantity: number;
    limitPrice?: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

export const StockTransaction: React.FC<StockTransactionProps> = ({
    symbol,
    companyName,
    currentPrice,
    availableCash,
    onExecuteTransaction
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
    const [quantity, setQuantity] = useState<number>(0);
    const [limitPrice, setLimitPrice] = useState<number | undefined>(undefined);
    const [totalCost, setTotalCost] = useState<number>(0);

    useEffect(() => {
        const price = orderType === 'market' ? currentPrice : (limitPrice || 0);
        setTotalCost(quantity * price);
    }, [quantity, orderType, currentPrice, limitPrice]);

    const handleQuantityChange = (value: string) => {
        const newQuantity = parseInt(value, 10);
        setQuantity(isNaN(newQuantity) ? 0 : newQuantity);
    };

    const handleLimitPriceChange = (value: string) => {
        const newLimitPrice = parseFloat(value);
        setLimitPrice(isNaN(newLimitPrice) ? undefined : newLimitPrice);
    };

    const handleExecuteTransaction = async () => {
        const transactionDetails: TransactionDetails = {
            symbol,
            transactionType,
            orderType,
            quantity,
            limitPrice: orderType === 'limit' ? limitPrice : undefined
        };
        await onExecuteTransaction(transactionDetails);
        onClose();
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-col items-start">
                <h2 className="text-2xl font-bold">{symbol} - {companyName}</h2>
                <p className="text-md">Current Price: {formatCurrency(currentPrice)}</p>
            </CardHeader>
            <CardBody className="space-y-4">
                <RadioGroup
                    label="Transaction Type"
                    orientation="horizontal"
                    value={transactionType}
                    onValueChange={(value) => setTransactionType(value as 'buy' | 'sell')}
                >
                    <Radio value="buy">Buy</Radio>
                    <Radio value="sell">Sell</Radio>
                </RadioGroup>

                <Select
                    label="Order Type"
                    selectedKeys={[orderType]}
                    onSelectionChange={(keys) => setOrderType(Array.from(keys)[0] as 'market' | 'limit')}
                >
                    <SelectItem key="market">Market Order</SelectItem>
                    <SelectItem key="limit">Limit Order</SelectItem>
                </Select>

                <Input
                    label="Quantity"
                    type="number"
                    min={0}
                    value={quantity.toString()}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                />

                {orderType === 'limit' && (
                    <Input
                        label="Limit Price"
                        type="number"
                        min={0}
                        step={0.01}
                        value={limitPrice?.toString() || ''}
                        onChange={(e) => handleLimitPriceChange(e.target.value)}
                    />
                )}

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
                    <p>Type: {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</p>
                    <p>Order: {orderType.charAt(0).toUpperCase() + orderType.slice(1)}</p>
                    <p>Quantity: {quantity}</p>
                    {orderType === 'limit' && <p>Limit Price: {formatCurrency(limitPrice || 0)}</p>}
                    <p className="font-bold mt-2">Total Cost: {formatCurrency(totalCost)}</p>
                </div>
            </CardBody>
            <CardFooter>
                <Button color="primary" onPress={onOpen} className="w-full">
                    Preview Order
                </Button>
            </CardFooter>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Confirm Transaction</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to {transactionType} {quantity} shares of {symbol}?</p>
                        <p>Total Cost: {formatCurrency(totalCost)}</p>
                        <p>Available Cash: {formatCurrency(availableCash)}</p>
                        {transactionType === 'buy' && totalCost > availableCash && (
                            <p className="text-red-500">Warning: Insufficient funds</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleExecuteTransaction}>
                            Confirm {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export const StockTransactionExample = () => {
    const handleExecuteTransaction = async (transactionDetails: TransactionDetails) => {
        console.log('Executing transaction:', transactionDetails);
        // Here you would typically send this data to your backend or state management system
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        console.log('Transaction completed');
    };

    return (
        <StockTransaction
            symbol="AAPL"
            companyName="Apple Inc."
            currentPrice={150.25}
            availableCash={10000}
            onExecuteTransaction={handleExecuteTransaction}
        />
    );
};