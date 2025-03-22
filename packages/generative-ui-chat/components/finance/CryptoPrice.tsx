// generative-ui-chat/components/finance/crypto.tsx
'use client'

import React from 'react';
import { Icon } from "@iconify/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "../../ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "../../ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

interface CryptoData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume24h: number;
    circulatingSupply: number;
    allTimeHigh: number;
    historicalData: { date: string; price: number }[];
}

interface CryptoComponentProps {
    data: CryptoData;
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
        return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
        return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
};

export const CryptoPrice: React.FC<CryptoComponentProps> = ({ data }) => {
    const isPositiveChange = data.change >= 0;

    const chartConfig = {
        price: {
            label: "Price",
            color: "#10B981",
        },
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
            <Card className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="border-b border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-gray-100">{data.symbol}</CardTitle>
                            <CardDescription className="text-gray-300">{data.name}</CardDescription>
                        </div>
                        <div className="text-right">
                            <CardTitle className="text-gray-100">${formatNumber(data.price)}</CardTitle>
                            <CardDescription className={isPositiveChange ? "text-green-400" : "text-red-400"}>
                                <Icon
                                    icon={isPositiveChange ? "mdi:trending-up" : "mdi:trending-down"}
                                    className="inline mr-1"
                                />
                                {formatNumber(data.change)} ({formatNumber(data.changePercent)}%)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="bg-transparent">
                    <ChartContainer className="h-[200px] text-gray-300" config={chartConfig}>
                        <div>
                            <LineChart data={data.historicalData}>
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#10B981"
                                    strokeWidth={2}
                                />
                            </LineChart>
                            <ChartLegend>
                                <ChartLegendContent />
                            </ChartLegend>
                        </div>
                    </ChartContainer>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div className="p-3 rounded-lg bg-gray-800/50">
                            <p className="text-sm text-gray-400">Market Cap</p>
                            <p className="font-semibold text-gray-100">{formatLargeNumber(data.marketCap)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50">
                            <p className="text-sm text-gray-400">24h Volume</p>
                            <p className="font-semibold text-gray-100">{formatLargeNumber(data.volume24h)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50">
                            <p className="text-sm text-gray-400">Circulating Supply</p>
                            <p className="font-semibold text-gray-100">
                                {formatNumber(data.circulatingSupply)} {data.symbol}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50">
                            <p className="text-sm text-gray-400">All-Time High</p>
                            <p className="font-semibold text-gray-100">${formatNumber(data.allTimeHigh)}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-gray-700">
                    <div>
                        <p className="text-sm text-gray-400">Last Updated</p>
                        <p className="font-semibold text-gray-100">{new Date().toLocaleString()}</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export const CryptoPriceExample = () => {
    const exampleData: CryptoData = {
        symbol: "BTC",
        name: "Bitcoin",
        price: 45000.75,
        change: 1250.25,
        changePercent: 2.86,
        marketCap: 850000000000,
        volume24h: 28000000000,
        circulatingSupply: 18900000,
        allTimeHigh: 69000,
        historicalData: [
            { date: "2024-05-01", price: 42000.00 },
            { date: "2024-05-02", price: 43500.50 },
            { date: "2024-05-03", price: 44200.00 },
            { date: "2024-05-04", price: 43800.25 },
            { date: "2024-05-05", price: 45000.75 },
        ]
    };

    return <CryptoPrice data={exampleData} />;
};