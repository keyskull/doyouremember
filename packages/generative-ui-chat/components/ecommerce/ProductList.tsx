// generative-ui-chat/components/ecommerce/tracking.tsx
'use client';
import React from 'react';
import { Pagination } from "@heroui/react";
import { Product } from './Product';  // Assuming Product component is in the same directory


interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    inStock: boolean;
    onAddToCart: (id: string, quantity: number) => void;
  }

  
  interface ProductListProps {
    products: ProductProps[];
    itemsPerPage: number;
    onAddToCart: (id: string, quantity: number) => void;
  }
  
  export const ProductList: React.FC<ProductListProps> = ({
    products,
    itemsPerPage,
    onAddToCart
  }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
  
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentProducts.map((product) => (
            <div key={product.id} className="w-full">
              <Product {...product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            initialPage={1}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    );
  };
  
  // Example usage
  export const ProductListExample = () => {
    const exampleProducts: ProductProps[] = [
      {
          id: "prod_1",
          name: "Wireless Bluetooth Headphones",
          description: "High-quality sound with noise cancellation technology.",
          price: 199.99,
          discountPrice: 149.99,
          rating: 4.5,
          reviewCount: 128,
          imageUrl: "/api/placeholder/400/300",
          inStock: true,
          onAddToCart: function (id: string, quantity: number): void {
              throw new Error('Function not implemented.');
          }
      },
      {
          id: "prod_2",
          name: "Smartphone X",
          description: "Latest model with advanced camera and long battery life.",
          price: 999.99,
          rating: 4.8,
          reviewCount: 256,
          imageUrl: "/api/placeholder/400/300",
          inStock: true,
          onAddToCart: function (id: string, quantity: number): void {
              throw new Error('Function not implemented.');
          }
      },
      // Add more products as needed
    ];
  
    const handleAddToCart = (id: string, quantity: number) => {
      console.log(`Added product ${id} to cart. Quantity: ${quantity}`);
      // Here you would typically update your cart state or send a request to your backend
    };
  
    return (
      <ProductList
        products={exampleProducts}
        itemsPerPage={6}
        onAddToCart={handleAddToCart}
      />
    );
  };