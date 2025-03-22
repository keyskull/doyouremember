// generative-ui-chat/components/ecommerce/return.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody,  Textarea, Button, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";

interface ReturnRequestProps {
  orderNumber: string;
  onSubmit: (data: ReturnFormData) => void;
}

interface ReturnFormData {
  orderNumber: string;
  reason: string;
  description: string;
  returnMethod: 'refund' | 'exchange';
  items: string[];
}

const returnReasons = [
  "Item not as described",
  "Damaged item",
  "Wrong item received",
  "Item no longer needed",
  "Other"
];

export const ReturnRequest: React.FC<ReturnRequestProps> = ({ orderNumber, onSubmit }) => {
  const [formData, setFormData] = useState<ReturnFormData>({
    orderNumber,
    reason: '',
    description: '',
    returnMethod: 'refund',
    items: []
  });

  const handleInputChange = (field: keyof ReturnFormData, value: string | string[]) => {
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
        <h4 className="text-large font-bold">Return Request</h4>
        <p className="text-small text-default-500">Order #{orderNumber}</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Reason for Return"
            placeholder="Select a reason"
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            required
          >
            {returnReasons.map((reason) => (
              <SelectItem key={reason}>
                {reason}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label="Additional Details"
            placeholder="Please provide more information about your return request"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />

          <RadioGroup
            label="Return Method"
            value={formData.returnMethod}
            onChange={(value) => handleInputChange('returnMethod', value as unknown as 'refund' | 'exchange')}
          >
            <Radio value="refund">Refund</Radio>
            <Radio value="exchange">Exchange</Radio>
          </RadioGroup>

          <Select
            label="Items to Return"
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
            Submit Return Request
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export const ReturnRequestExample = () => {
  const handleSubmit = (data: ReturnFormData) => {
    console.log('Return request submitted:', data);
    // Here you would typically send this data to your backend
  };

  return <ReturnRequest orderNumber="12345" onSubmit={handleSubmit} />;
};