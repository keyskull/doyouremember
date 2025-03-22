// generative-ui-chat/components/finance/stock-news.tsx
'use client'

import React from 'react';
import { Card, CardHeader, CardBody, Link, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    source: string;
    url: string;
    publishedAt: Date;
    sentiment: 'positive' | 'neutral' | 'negative';
}

interface StockNewsProps {
    symbol: string;
    companyName: string;
    news: NewsArticle[];
    onLoadMore: () => void;
}

const getSentimentColor = (sentiment: NewsArticle['sentiment']) => {
    switch (sentiment) {
        case 'positive':
            return 'text-green-500';
        case 'negative':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
};

const getSentimentIcon = (sentiment: NewsArticle['sentiment']) => {
    switch (sentiment) {
        case 'positive':
            return 'mdi:trending-up';
        case 'negative':
            return 'mdi:trending-down';
        default:
            return 'mdi:trending-neutral';
    }
};

export const StockNews: React.FC<StockNewsProps> = ({ symbol, companyName, news, onLoadMore }) => {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Latest News for {symbol}</h2>
                <p className="text-sm text-gray-500">{companyName}</p>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    {news.map((article) => (
                        <Card key={article.id} className="w-full">
                            <CardBody>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{article.title}</h3>
                                    <div className={`flex items-center ${getSentimentColor(article.sentiment)}`}>
                                        <Icon icon={getSentimentIcon(article.sentiment)} className="mr-1" />
                                        <span className="text-sm capitalize">{article.sentiment}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{article.source}</span>
                                    <span>{article.publishedAt.toLocaleDateString()}</span>
                                </div>
                                <Link 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block"
                                >
                                    Read full article
                                    <Icon icon="mdi:external-link" className="inline ml-1" />
                                </Link>
                            </CardBody>
                        </Card>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <Button color="primary" variant="flat" onPress={onLoadMore}>
                        Load More News
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export const StockNewsExample = () => {
    const exampleNews: NewsArticle[] = [
        {
            id: '1',
            title: 'Company XYZ Announces Record Quarterly Earnings',
            summary: 'XYZ Corp. reported Q2 earnings that exceeded analyst expectations, driven by strong growth in its cloud services division.',
            source: 'Financial Times',
            url: 'https://example.com/news/1',
            publishedAt: new Date('2024-05-15T10:30:00'),
            sentiment: 'positive'
        },
        {
            id: '2',
            title: 'Market Analyst Predicts Challenges for Tech Sector',
            summary: 'Leading market analyst warns of potential headwinds for the tech sector in the coming months, citing regulatory concerns.',
            source: 'Wall Street Journal',
            url: 'https://example.com/news/2',
            publishedAt: new Date('2024-05-14T14:45:00'),
            sentiment: 'negative'
        },
        {
            id: '3',
            title: 'New Product Launch Receives Mixed Reviews',
            summary: 'The latest product from XYZ Corp. has received mixed reviews from tech critics, with praise for innovation but concerns about pricing.',
            source: 'TechCrunch',
            url: 'https://example.com/news/3',
            publishedAt: new Date('2024-05-13T09:15:00'),
            sentiment: 'neutral'
        }
    ];

    const handleLoadMore = () => {
        console.log('Loading more news articles...');
        // Here you would typically fetch more news articles and update the state
    };

    return (
        <StockNews
            symbol="XYZ"
            companyName="XYZ Corporation"
            news={exampleNews}
            onLoadMore={handleLoadMore}
        />
    );
};