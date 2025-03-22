// generative-ui-chat/components/ecommerce/order.tsx
'use client';
import React from 'react';
import { Card, CardBody, CardHeader, Divider, Image, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetailProps {
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
  orderNumber,
  orderDate,
  orderStatus,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <div>
          <h3 className="text-2xl font-bold">Order #{orderNumber}</h3>
          <p className="text-small text-default-500">Placed on {orderDate}</p>
        </div>
        <div className="flex items-center">
          <Icon icon="mdi:truck-delivery-outline" className="mr-2" />
          <span className="font-semibold">{orderStatus}</span>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Items</h4>
            {items.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div>
                  <h5 className="font-semibold">{item.name}</h5>
                  <p className="text-small text-default-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-small font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Divider />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Divider className="my-4" />
            <h4 className="text-lg font-semibold mb-2">Shipping Address</h4>
            <address className="not-italic">
              {shippingAddress.name}<br />
              {shippingAddress.street}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
              {shippingAddress.country}
            </address>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardBody className="p-6">
        <div className="flex justify-end space-x-4">
          <Button color="primary" variant="light">
            <Icon icon="mdi:email-outline" className="mr-2" />
            Contact Support
          </Button>
          <Button color="primary">
            <Icon icon="mdi:receipt" className="mr-2" />
            Download Invoice
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export const OrderDetailExample = () => {
  const exampleProps: OrderDetailProps = {
    orderNumber: "12345",
    orderDate: "May 10, 2024",
    orderStatus: "Shipped",
    items: [
      { id: '1', name: 'Wireless Headphones', price: 99.99, quantity: 1, image: '/api/placeholder/100x100' },
      { id: '2', name: 'Smartphone Case', price: 19.99, quantity: 2, image: '/api/placeholder/100x100' },
    ],
    subtotal: 139.97,
    shipping: 5.99,
    tax: 11.20,
    total: 157.16,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "United States"
    }
  };

  return <OrderDetail {...exampleProps} />;
};