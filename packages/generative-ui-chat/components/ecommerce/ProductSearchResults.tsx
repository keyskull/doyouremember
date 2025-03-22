// generative-ui-chat/components/ecommerce/product-search-result.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Image, Pagination, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    rating: number;
}

interface ProductSearchResultsProps {
    searchTerm: string;
    products: Product[];
    onProductClick: (productId: string) => void;
}

const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' },
    { value: 'priceHighToLow', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' }
];

export const ProductSearchResults: React.FC<ProductSearchResultsProps> = ({
    searchTerm,
    products,
    onProductClick
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const itemsPerPage = 12;

    const sortProducts = (products: Product[], sortBy: string) => {
        switch (sortBy) {
            case 'priceLowToHigh':
                return [...products].sort((a, b) => a.price - b.price);
            case 'priceHighToLow':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...products].sort((a, b) => b.rating - a.rating);
            default:
                return products; // Relevance (default order)
        }
    };

    const sortedProducts = sortProducts(products, sortBy);
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Search Results for &quot;{searchTerm}&quot;</h2>
            <div className="flex justify-between items-center mb-4">
                <p>{products.length} results found</p>
                <Select
                    label="Sort by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-48"
                >
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                    <Card
                        key={product.id}
                        isPressable
                        onPress={() => onProductClick(product.id)}
                        className="max-w-xs"
                    >
                        <CardBody className="p-0">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                        </CardBody>
                        <CardFooter className="flex-col items-start">
                            <h3 className="text-md font-semibold">{product.name}</h3>
                            <p className="text-small text-default-500">{product.description}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                <div className="flex items-center ml-2">
                                    <Icon icon="mdi:star" className="text-yellow-400" />
                                    <span className="ml-1">{product.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <Pagination
                    total={totalPages}
                    initialPage={1}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export const ProductSearchResultsExample = () => {
    const exampleProducts: Product[] = [
        {
            id: "1",
            name: "Wireless Earbuds",
            description: "High-quality sound with noise cancellation",
            price: 79.99,
            imageUrl: "/api/placeholder/300/200",
            rating: 4.5
        },
        {
            id: "2",
            name: "Smart Watch",
            description: "Fitness tracker with heart rate monitor",
            price: 129.99,
            imageUrl: "/api/placeholder/300/200",
            rating: 4.2
        },
        // Add more products...
    ];

    const handleProductClick = (productId: string) => {
        console.log(`Clicked on product: ${productId}`);
        // Here you would typically navigate to the product detail page
    };

    return (
        <ProductSearchResults
            searchTerm="wireless"
            products={exampleProducts}
            onProductClick={handleProductClick}
        />
    );
};