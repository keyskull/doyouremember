// generative-ui-chat/components/ecommerce/product-recommandation.tsx
'use client';

import React from 'react';
import { Card, CardBody, CardFooter, Image, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface RecommendedProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductRecommendationProps {
    title: string;
    products: RecommendedProduct[];
    onProductClick: (productId: string) => void;
}

export const ProductRecommendation: React.FC<ProductRecommendationProps> = ({
    title,
    products,
    onProductClick
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
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
                                className="w-full h-40 object-cover"
                            />
                        </CardBody>
                        <CardFooter className="flex-col items-start">
                            <h3 className="text-md font-semibold">{product.name}</h3>
                            <p className="text-default-500">${product.price.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const ProductRecommendationExample = () => {
    const exampleProducts: RecommendedProduct[] = [
        {
            id: "rec_1",
            name: "Wireless Earbuds",
            price: 79.99,
            imageUrl: "/api/placeholder/300/200",
        },
        {
            id: "rec_2",
            name: "Bluetooth Speaker",
            price: 59.99,
            imageUrl: "/api/placeholder/300/200",
        },
        {
            id: "rec_3",
            name: "Phone Case",
            price: 19.99,
            imageUrl: "/api/placeholder/300/200",
        },
        {
            id: "rec_4",
            name: "Screen Protector",
            price: 9.99,
            imageUrl: "/api/placeholder/300/200",
        },
        {
            id: "rec_5",
            name: "Power Bank",
            price: 39.99,
            imageUrl: "/api/placeholder/300/200",
        },
    ];

    const handleProductClick = (productId: string) => {
        console.log(`Clicked on product: ${productId}`);
        // Here you would typically navigate to the product page or open a quick view modal
    };

    return (
        <ProductRecommendation
            title="You May Also Like"
            products={exampleProducts}
            onProductClick={handleProductClick}
        />
    );
};