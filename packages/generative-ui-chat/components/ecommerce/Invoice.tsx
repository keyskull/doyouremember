// generative-ui-chat/components/ecommerce/invoice.tsx
'use client';
import React from 'react';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from "@heroui/react";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const Invoice: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  customerName,
  customerEmail,
  items,
  subtotal,
  tax,
  shipping,
  total
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h2 className="text-2xl font-bold">Invoice</h2>
        <p className="text-small text-default-500">Invoice Number: {invoiceNumber}</p>
        <p className="text-small text-default-500">Date: {date}</p>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Bill To:</h3>
          <p>{customerName}</p>
          <p>{customerEmail}</p>
        </div>
        <Table aria-label="Invoice items">
          <TableHeader>
            <TableColumn>ITEM</TableColumn>
            <TableColumn>QUANTITY</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>TOTAL</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{formatCurrency(item.quantity * item.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Divider className="my-4" />
        <div className="flex flex-col items-end">
          <div className="flex justify-between w-full max-w-xs">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between w-full max-w-xs">
            <span>Tax:</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between w-full max-w-xs">
            <span>Shipping:</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <Divider className="my-2 w-full max-w-xs" />
          <div className="flex justify-between w-full max-w-xs font-bold">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const InvoiceExample = () => {
  const exampleProps: InvoiceProps = {
    invoiceNumber: "INV-001",
    date: "2024-05-15",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    items: [
      { id: "1", name: "Product A", quantity: 2, price: 19.99 },
      { id: "2", name: "Product B", quantity: 1, price: 29.99 },
      { id: "3", name: "Product C", quantity: 3, price: 9.99 },
    ],
    subtotal: 99.94,
    tax: 8.00,
    shipping: 5.00,
    total: 112.94
  };

  return <Invoice {...exampleProps} />;
};