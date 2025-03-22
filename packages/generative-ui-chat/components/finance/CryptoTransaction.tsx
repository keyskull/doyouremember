// generative-ui-chat/components/finance/crypto-transaction.tsx
'use client'

import React from 'react';
import { Card, CardHeader, CardBody, Chip, Link, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CryptoTransaction {
    id: string;
    type: 'send' | 'receive';
    amount: number;
    cryptoSymbol: string;
    cryptoName: string;
    fiatValue: number;
    fiatCurrency: string;
    fromAddress: string;
    toAddress: string;
    timestamp: Date;
    confirmations: number;
    fee: number;
    status: 'pending' | 'completed' | 'failed';
    blockExplorerUrl: string;
}

interface CryptoTransactionProps {
    transaction: CryptoTransaction;
}

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getStatusColor = (status: CryptoTransaction['status']) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'completed':
            return 'success';
        case 'failed':
            return 'danger';
        default:
            return 'default';
    }
};

export const CryptoTransaction: React.FC<CryptoTransactionProps> = ({ transaction }) => {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center">
                    <Icon 
                        icon={transaction.type === 'send' ? 'mdi:arrow-top-right' : 'mdi:arrow-bottom-left'} 
                        className={`text-2xl ${transaction.type === 'send' ? 'text-red-500' : 'text-green-500'} mr-2`}
                    />
                    <div>
                        <h2 className="text-xl font-bold">{transaction.type === 'send' ? 'Sent' : 'Received'} {transaction.cryptoName}</h2>
                        <p className="text-sm text-gray-500">{transaction.timestamp.toLocaleString()}</p>
                    </div>
                </div>
                <Chip color={getStatusColor(transaction.status)} variant="flat">
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Chip>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-semibold">{transaction.amount} {transaction.cryptoSymbol}</p>
                        <p className="text-sm text-gray-500">
                            {formatCurrency(transaction.fiatValue, transaction.fiatCurrency)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Network Fee</p>
                        <p className="font-semibold">{transaction.fee} {transaction.cryptoSymbol}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">From</p>
                        <Tooltip content={transaction.fromAddress}>
                            <p className="font-semibold">{formatAddress(transaction.fromAddress)}</p>
                        </Tooltip>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">To</p>
                        <Tooltip content={transaction.toAddress}>
                            <p className="font-semibold">{formatAddress(transaction.toAddress)}</p>
                        </Tooltip>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <Tooltip content={transaction.id}>
                            <p className="font-semibold">{formatAddress(transaction.id)}</p>
                        </Tooltip>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Confirmations</p>
                        <p className="font-semibold">{transaction.confirmations}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href={transaction.blockExplorerUrl} target="_blank" rel="noopener noreferrer">
                        View on Block Explorer
                        <Icon icon="mdi:external-link" className="ml-1" />
                    </Link>
                </div>
            </CardBody>
        </Card>
    );
};

export const CryptoTransactionExample = () => {
    const exampleTransaction: CryptoTransaction = {
        id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        type: 'send',
        amount: 0.05,
        cryptoSymbol: 'ETH',
        cryptoName: 'Ethereum',
        fiatValue: 150.75,
        fiatCurrency: 'USD',
        fromAddress: '0x1234567890123456789012345678901234567890',
        toAddress: '0x0987654321098765432109876543210987654321',
        timestamp: new Date('2024-05-15T10:30:00'),
        confirmations: 15,
        fee: 0.002,
        status: 'completed',
        blockExplorerUrl: 'https://etherscan.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    };

    return <CryptoTransaction transaction={exampleTransaction} />;
};