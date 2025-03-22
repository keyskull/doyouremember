// generative-ui-chat/components/finance/crypto-wallet.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CryptoHolding {
    id: string;
    symbol: string;
    name: string;
    amount: number;
    value: number;
}

interface CryptoWalletProps {
    holdings: CryptoHolding[];
    onSend: (amount: number, to: string, cryptoId: string) => void;
    onReceive: (cryptoId: string) => string; // Returns a deposit address
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

export const CryptoWallet: React.FC<CryptoWalletProps> = ({ holdings, onSend, onReceive }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoHolding | null>(null);
    const [sendAmount, setSendAmount] = useState<string>('');
    const [sendAddress, setSendAddress] = useState<string>('');
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [modalMode, setModalMode] = useState<'send' | 'receive'>('send');

    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

    const handleSendClick = (crypto: CryptoHolding) => {
        setSelectedCrypto(crypto);
        setModalMode('send');
        onOpen();
    };

    const handleReceiveClick = (crypto: CryptoHolding) => {
        setSelectedCrypto(crypto);
        setModalMode('receive');
        const address = onReceive(crypto.id);
        setReceiveAddress(address);
        onOpen();
    };

    const handleSendSubmit = () => {
        if (selectedCrypto) {
            onSend(parseFloat(sendAmount), sendAddress, selectedCrypto.id);
            onClose();
            setSendAmount('');
            setSendAddress('');
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Crypto Wallet</h2>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
                </div>
            </CardHeader>
            <CardBody>
                <Table aria-label="Cryptocurrency holdings">
                    <TableHeader>
                        <TableColumn>ASSET</TableColumn>
                        <TableColumn>BALANCE</TableColumn>
                        <TableColumn>VALUE</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {holdings.map((holding) => (
                            <TableRow key={holding.id}>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Icon icon={`cryptocurrency:${holding.symbol.toLowerCase()}`} className="mr-2" />
                                        <div>
                                            <p className="font-medium">{holding.name}</p>
                                            <p className="text-sm text-gray-500">{holding.symbol}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{holding.amount} {holding.symbol}</TableCell>
                                <TableCell>{formatCurrency(holding.value)}</TableCell>
                                <TableCell>
                                    <Button size="sm" color="primary" variant="flat" className="mr-2" onPress={() => handleSendClick(holding)}>Send</Button>
                                    <Button size="sm" color="secondary" variant="flat" onPress={() => handleReceiveClick(holding)}>Receive</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardBody>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {modalMode === 'send' ? (
                        <>
                            <ModalHeader>Send {selectedCrypto?.symbol}</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={sendAmount}
                                    onChange={(e) => setSendAmount(e.target.value)}
                                />
                                <Input
                                    label="To Address"
                                    placeholder="Enter recipient's address"
                                    value={sendAddress}
                                    onChange={(e) => setSendAddress(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>Cancel</Button>
                                <Button color="primary" onPress={handleSendSubmit}>Send</Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader>Receive {selectedCrypto?.symbol}</ModalHeader>
                            <ModalBody>
                                <p>Use the address below to receive {selectedCrypto?.symbol}:</p>
                                <Input
                                    readOnly
                                    value={receiveAddress}
                                    label="Your Deposit Address"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Card>
    );
};

export const CryptoWalletExample = () => {
    const exampleHoldings: CryptoHolding[] = [
        { id: '1', symbol: 'BTC', name: 'Bitcoin', amount: 0.5, value: 22500 },
        { id: '2', symbol: 'ETH', name: 'Ethereum', amount: 4, value: 8000 },
        { id: '3', symbol: 'ADA', name: 'Cardano', amount: 1000, value: 500 },
    ];

    const handleSend = (amount: number, to: string, cryptoId: string) => {
        console.log(`Sending ${amount} of crypto ${cryptoId} to ${to}`);
        // Here you would typically integrate with a crypto sending service or API
    };

    const handleReceive = (cryptoId: string) => {
        // Here you would typically generate or fetch a deposit address for the given crypto
        return `example-address-for-${cryptoId}`;
    };

    return <CryptoWallet holdings={exampleHoldings} onSend={handleSend} onReceive={handleReceive} />;
};