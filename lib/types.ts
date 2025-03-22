// lib/types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isOneTimePurchase: boolean;
}


export interface CartItem extends Product {
  quantity: number;
}


export interface OrderItem {
  items: string; // JSON string of CartItem[]
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'canceled';
  createdAt: string;
  updatedAt: string;
  orderItem: OrderItem | null;
  billingAddress: Address;
  shippingAddress: Address;
  name: string | null;
  isBusiness: boolean;
  taxId: string | null;
  taxExempt: boolean;
  taxExemptionId: string | null;
  taxAmount: number;
  vatNumber: string | null;
  vatAmount: number | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  items: Product[];
  total: number;
  tax: number;
  grandTotal: number;
  createdAt: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}
