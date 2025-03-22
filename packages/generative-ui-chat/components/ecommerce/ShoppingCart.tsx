// generative-ui-chat/components/ecommerce/cart.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Button, Image, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardBody>
        <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="flex flex-col items-end">
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button color="primary" size="lg" className="w-full mt-4" onClick={onCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const CartItemRow: React.FC<{
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center space-x-4">
      <Image
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
        >
          <Icon icon="mdi:minus" />
        </Button>
        <Input
          type="number"
          value={quantity.toString()}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          className="w-16 text-center"
        />
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <Icon icon="mdi:plus" />
        </Button>
      </div>
      <Button
        isIconOnly
        color="danger"
        variant="light"
        onClick={() => onRemoveItem(item.id)}
      >
        <Icon icon="mdi:trash" />
      </Button>
    </div>
  );
};

export const ShoppingCartExample = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Product 1', price: 19.99, quantity: 2, image: '/api/placeholder/50x50' },
    { id: '2', name: 'Product 2', price: 29.99, quantity: 1, image: '/api/placeholder/50x50' },
  ]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
  };

  return (
    <ShoppingCart
      items={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
};