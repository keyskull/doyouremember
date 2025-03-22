// generative-ui-chat/components/ecommerce/checkout.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, RadioGroup, Radio, Checkbox, Divider } from "@heroui/react";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  items: CheckoutItem[];
  onCheckout: (shippingDetails: ShippingDetails, paymentDetails: PaymentDetails) => void;
}

interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ items, onCheckout }) => {
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [shippingMethod, setShippingMethod] = useState<string>('standard');

  const handleShippingInputChange = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInputChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(shippingDetails, paymentDetails);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === 'express' ? 15 : 5;
    return subtotal + shippingCost;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <CardHeader>
            <h2 className="text-xl font-bold">Shipping Information</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={shippingDetails.fullName}
              onChange={(e) => handleShippingInputChange('fullName', e.target.value)}
              required
            />
            <Input
              label="Address"
              placeholder="123 Main St"
              value={shippingDetails.address}
              onChange={(e) => handleShippingInputChange('address', e.target.value)}
              required
            />
            <Input
              label="City"
              placeholder="New York"
              value={shippingDetails.city}
              onChange={(e) => handleShippingInputChange('city', e.target.value)}
              required
            />
            <Input
              label="ZIP Code"
              placeholder="10001"
              value={shippingDetails.zipCode}
              onChange={(e) => handleShippingInputChange('zipCode', e.target.value)}
              required
            />
            <Input
              label="Country"
              placeholder="United States"
              value={shippingDetails.country}
              onChange={(e) => handleShippingInputChange('country', e.target.value)}
              required
            />
          </CardBody>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <h2 className="text-xl font-bold">Payment Information</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber}
              onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
              required
            />
            <Input
              label="Name on Card"
              placeholder="John Doe"
              value={paymentDetails.cardName}
              onChange={(e) => handlePaymentInputChange('cardName', e.target.value)}
              required
            />
            <div className="flex gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                required
              />
              <Input
                label="CVV"
                placeholder="123"
                value={paymentDetails.cvv}
                onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                required
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6 p-4">
        <CardHeader>
          <h2 className="text-xl font-bold">Order Summary</h2>
        </CardHeader>
        <CardBody>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Divider className="my-4" />
          <RadioGroup
            label="Shipping Method"
            value={shippingMethod}
            onValueChange={setShippingMethod}
          >
            <Radio value="standard">Standard Shipping ($5)</Radio>
            <Radio value="express">Express Shipping ($15)</Radio>
          </RadioGroup>
          <Divider className="my-4" />
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6">
        <Checkbox required>
          I agree to the terms and conditions
        </Checkbox>
      </div>

      <Button type="submit" color="primary" className="mt-6 w-full">
        Place Order
      </Button>
    </form>
  );
};

export const CheckoutExample = () => {
  const exampleItems: CheckoutItem[] = [
    { id: '1', name: 'Product 1', price: 19.99, quantity: 2 },
    { id: '2', name: 'Product 2', price: 29.99, quantity: 1 },
  ];

  const handleCheckout = (shippingDetails: ShippingDetails, paymentDetails: PaymentDetails) => {
    console.log('Checkout submitted:', { shippingDetails, paymentDetails });
    // Here you would typically process the order, send data to your backend, etc.
  };

  return <Checkout items={exampleItems} onCheckout={handleCheckout} />;
};