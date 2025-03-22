// generative-ui-chat/components/ecommerce/product.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Image, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

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

const Rating: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= value ? "mdi:star" : "mdi:star-outline"}
          className={star <= value ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

const getFormattedDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

export const Product: React.FC<ProductProps> = ({
  id,
  name,
  description,
  price,
  discountPrice,
  rating,
  reviewCount,
  imageUrl,
  inStock,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [timestamp, setTimestamp] = useState(() => getFormattedDate(new Date()));

  useEffect(() => {
    setTimestamp(getFormattedDate(new Date()));
  }, []);

  const handleQuantityChange = (increment: number) => {
    setQuantity(Math.max(1, quantity + increment));
  };

  return (
    <Card className="w-full max-w-sm">
      <CardBody className="p-0">
        <Image
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-small text-default-500 mt-1">{description}</p>
          <div className="flex items-center mt-2">
            <Rating value={rating} />
            <span className="text-small text-default-400 ml-2">({reviewCount} reviews)</span>
          </div>
          <div className="flex items-center mt-2">
            {discountPrice ? (
              <>
                <span className="text-lg font-bold text-danger">${discountPrice.toFixed(2)}</span>
                <span className="text-small text-default-400 line-through ml-2">${price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold">${price.toFixed(2)}</span>
            )}
          </div>
          <Chip color={inStock ? "success" : "danger"} variant="flat" className="mt-2">
            {inStock ? "In Stock" : "Out of Stock"}
          </Chip>
          <p className="font-semibold text-gray-100">
            {timestamp}
          </p>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            isIconOnly
            variant="light"
            onPress={() => handleQuantityChange(-1)}
            isDisabled={quantity === 1}
          >
            <Icon icon="mdi:minus" />
          </Button>
          <span className="mx-2">{quantity}</span>
          <Button
            isIconOnly
            variant="light"
            onPress={() => handleQuantityChange(1)}
          >
            <Icon icon="mdi:plus" />
          </Button>
        </div>
        <Button
          color="primary"
          onPress={() => onAddToCart(id, quantity)}
          isDisabled={!inStock}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ProductExample = () => {
  const handleAddToCart = (id: string, quantity: number) => {
    console.log(`Added product ${id} to cart. Quantity: ${quantity}`);
    // Here you would typically update your cart state or send a request to your backend
  };

  const exampleProps: ProductProps = {
    id: "laptop-1",
    name: "Gaming Laptop RTX5090",
    description: "High-performance gaming laptop with the latest RTX5090 graphics card",
    price: 899,
    rating: 4.5,
    reviewCount: 128,
    imageUrl: "/images/products/rtx5090-laptop.png",
    inStock: true,
    onAddToCart: handleAddToCart
  };

  return <Product {...exampleProps} />;
};