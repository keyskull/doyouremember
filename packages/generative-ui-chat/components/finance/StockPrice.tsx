// generative-ui-chat/components/finance/stock.tsx
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

interface StockData {
    symbol: string;
    companyName: string;
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
    open: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    historicalData: { date: string; price: number }[];
}

interface StockPriceProps {
    data: StockData;
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

export const StockPrice: React.FC<StockPriceProps> = ({ data }) => {
    const isPositiveChange = data.change >= 0;

    const chartConfig = {
        price: {
            label: "Price",
            color: "#8884d8",
        },
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{data.symbol}</CardTitle>
                        <CardDescription>{data.companyName}</CardDescription>
                    </div>
                    <div className="text-right">
                        <CardTitle>${formatNumber(data.price)}</CardTitle>
                        <CardDescription className={isPositiveChange ? "text-green-500" : "text-red-500"}>
                            <Icon
                                icon={isPositiveChange ? "mdi:trending-up" : "mdi:trending-down"}
                                className="inline mr-1"
                            />
                            {formatNumber(data.change)} ({formatNumber(data.changePercent)}%)
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-[200px]" config={chartConfig}>
                    <div>
                        <LineChart data={data.historicalData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />

                            <Line type="monotone" dataKey="price" stroke="#8884d8" />
                        </LineChart>
                        <ChartLegend>
                            <ChartLegendContent />
                        </ChartLegend>
                    </div>
                </ChartContainer>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Previous Close</p>
                        <p className="font-semibold">${formatNumber(data.previousClose)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Open</p>
                        <p className="font-semibold">${formatNumber(data.open)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Day&apos;s High</p>
                        <p className="font-semibold">${formatNumber(data.dayHigh)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Day&apos;s Low</p>
                        <p className="font-semibold">${formatNumber(data.dayLow)}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="font-semibold">{formatVolume(data.volume)}</p>
                </div>
            </CardFooter>
        </Card>
    );
};

export const StockPriceExample = () => {
    const exampleData: StockData = {
        symbol: "AAPL",
        companyName: "Apple Inc.",
        price: 150.25,
        change: 2.75,
        changePercent: 1.86,
        previousClose: 147.50,
        open: 148.30,
        dayHigh: 151.00,
        dayLow: 147.80,
        volume: 75000000,
        historicalData: [
            { date: "2024-05-01", price: 145.00 },
            { date: "2024-05-02", price: 146.50 },
            { date: "2024-05-03", price: 148.00 },
            { date: "2024-05-04", price: 147.50 },
            { date: "2024-05-05", price: 150.25 },
        ]
    };

    return <StockPrice data={exampleData} />;
};