// generative-ui-chat/components/ecommerce/refund.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Textarea, Button, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";

interface RefundRequestProps {
  orderNumber: string;
  onSubmit: (data: RefundFormData) => void;
}

interface RefundFormData {
  orderNumber: string;
  reason: string;
  description: string;
  refundMethod: 'original' | 'store_credit';
  items: string[];
}

const refundReasons = [
  "Item not as described",
  "Damaged item",
  "Wrong item received",
  "Item no longer needed",
  "Other"
];

export const RefundRequest: React.FC<RefundRequestProps> = ({ orderNumber, onSubmit }) => {
  const [formData, setFormData] = useState<RefundFormData>({
    orderNumber,
    reason: '',
    description: '',
    refundMethod: 'original',
    items: []
  });

  const handleInputChange = (field: keyof RefundFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Mock order items (in a real application, these would be fetched based on the order number)
  const orderItems = [
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' },
    { id: '3', name: 'Product 3' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">Refund Request</h4>
        <p className="text-small text-default-500">Order #{orderNumber}</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Reason for Refund"
            placeholder="Select a reason"
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            required
          >
            {refundReasons.map((reason) => (
              <SelectItem key={reason}>
                {reason}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label="Additional Details"
            placeholder="Please provide more information about your refund request"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />

          <RadioGroup
            label="Refund Method"
            value={formData.refundMethod}
            onChange={(value) => handleInputChange('refundMethod', value as unknown as 'original' | 'store_credit')}
          >
            <Radio value="original">Original Payment Method</Radio>
            <Radio value="store_credit">Store Credit</Radio>
          </RadioGroup>

          <Select
            label="Items to Refund"
            placeholder="Select items"
            selectionMode="multiple"
            value={formData.items}
            onChange={(e) => handleInputChange('items', Array.from(e.target.selectedOptions, option => option.value))}
            required
          >
            {orderItems.map((item) => (
              <SelectItem key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>

          <Button color="primary" type="submit" className="w-full">
            Submit Refund Request
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export const RefundRequestExample = () => {
  const handleSubmit = (data: RefundFormData) => {
    console.log('Refund request submitted:', data);
    // Here you would typically send this data to your backend
  };

  return <RefundRequest orderNumber="12345" onSubmit={handleSubmit} />;
};