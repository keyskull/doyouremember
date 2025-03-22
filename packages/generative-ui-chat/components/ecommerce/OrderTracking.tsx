// generative-ui-chat/components/ecommerce/tracking.tsx
'use client';
import React from 'react';
import { Card, CardBody, CardHeader, Divider, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TrackingStep {
  status: 'completed' | 'in-progress' | 'pending';
  label: string;
  description: string;
  date: string;
}

interface OrderTrackingProps {
  orderNumber: string;
  estimatedDelivery: string;
  currentStatus: string;
  steps: TrackingStep[];
}

const getStatusIcon = (status: TrackingStep['status']) => {
  switch (status) {
    case 'completed':
      return <Icon icon="mdi:check-circle" className="text-success text-xl" />;
    case 'in-progress':
      return <Icon icon="mdi:clock-outline" className="text-primary text-xl" />;
    case 'pending':
      return <Icon icon="mdi:clock-outline" className="text-gray-400 text-xl" />;
  }
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderNumber,
  estimatedDelivery,
  currentStatus,
  steps
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">Order #{orderNumber}</h4>
        <p className="text-small text-default-500">Estimated Delivery: {estimatedDelivery}</p>
        <Chip color="primary" variant="flat" className="mt-2">
          {currentStatus}
        </Chip>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                {getStatusIcon(step.status)}
                {index < steps.length - 1 && (
                  <div className={`w-px h-full mt-2 ${step.status === 'completed' ? 'bg-success' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{step.label}</p>
                <p className="text-small text-default-500">{step.description}</p>
                <p className="text-tiny text-default-400 mt-1">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export const OrderTrackingExample = () => {
  const exampleProps: OrderTrackingProps = {
    orderNumber: "12345",
    estimatedDelivery: "May 15, 2024",
    currentStatus: "In Transit",
    steps: [
      {
        status: 'completed',
        label: 'Order Placed',
        description: 'Your order has been placed successfully',
        date: 'May 10, 2024 09:30 AM'
      },
      {
        status: 'completed',
        label: 'Order Processed',
        description: 'Your order has been processed and is being prepared for shipment',
        date: 'May 11, 2024 02:45 PM'
      },
      {
        status: 'in-progress',
        label: 'In Transit',
        description: 'Your package is on its way to you',
        date: 'May 12, 2024 10:15 AM'
      },
      {
        status: 'pending',
        label: 'Out for Delivery',
        description: 'Your package will be delivered today',
        date: 'Pending'
      },
      {
        status: 'pending',
        label: 'Delivered',
        description: 'Your package has been delivered',
        date: 'Pending'
      }
    ]
  };

  return <OrderTracking {...exampleProps} />;
};