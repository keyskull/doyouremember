// generative-ui-chat/components/ecommerce/orders.tsx
'use client';
import React from 'react';
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onReorder: (orderId: string) => void;
}

const statusColorMap = {
  processing: "primary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "danger"
} as const;

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  onViewDetails,
  onReorder
}) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(orders.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return orders.slice(start, end);
  }, [page, orders]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardBody>
        <h2 className="text-2xl font-bold mb-4">Order History</h2>
        <Table
          aria-label="Order history table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>ORDER ID</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Chip color={statusColorMap[item.status]} variant="flat">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Chip>
                </TableCell>
                <TableCell>${item.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="flat" onPress={() => onViewDetails(item.id)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="flat" onPress={() => onReorder(item.id)}>
                      Reorder
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export const OrderHistoryExample = () => {
  const exampleOrders: Order[] = [
    {
      id: "ORD-001",
      date: "2024-05-15",
      status: "delivered",
      total: 79.99,
      items: [
        { id: "ITEM-1", name: "Product A", quantity: 2, price: 29.99 },
        { id: "ITEM-2", name: "Product B", quantity: 1, price: 20.01 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-05-20",
      status: "processing",
      total: 149.99,
      items: [
        { id: "ITEM-3", name: "Product C", quantity: 1, price: 149.99 }
      ]
    },
    {
      id: "ORD-003",
      date: "2024-05-25",
      status: "shipped",
      total: 59.98,
      items: [
        { id: "ITEM-4", name: "Product D", quantity: 2, price: 29.99 }
      ]
    },
    {
      id: "ORD-004",
      date: "2024-05-30",
      status: "cancelled",
      total: 89.97,
      items: [
        { id: "ITEM-5", name: "Product E", quantity: 3, price: 29.99 }
      ]
    },
    {
      id: "ORD-005",
      date: "2024-06-05",
      status: "processing",
      total: 199.99,
      items: [
        { id: "ITEM-6", name: "Product F", quantity: 1, price: 199.99 }
      ]
    },
    {
      id: "ORD-006",
      date: "2024-06-10",
      status: "delivered",
      total: 39.99,
      items: [
        { id: "ITEM-7", name: "Product G", quantity: 1, price: 39.99 }
      ]
    }
  ];

  const handleViewDetails = (orderId: string) => {
    console.log(`Viewing details for order: ${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    console.log(`Reordering items from order: ${orderId}`);
  };

  return (
    <OrderHistory
      orders={exampleOrders}
      onViewDetails={handleViewDetails}
      onReorder={handleReorder}
    />
  );
};