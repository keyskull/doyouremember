// contexts/PurchaseHistoryContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Purchase {
  id: string;
  productId: string;
  productName: string;
  price: number;
  date: Date;
}

interface PurchaseHistoryContextType {
  initialized: boolean;
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => void;
}

const PurchaseHistoryContext = createContext<PurchaseHistoryContextType | undefined>(undefined);

export function PurchaseHistoryProvider({ children }: { children: ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const addPurchase = (purchase: Purchase) => {
    setPurchases(prevPurchases => [...prevPurchases, purchase]);
  };

  return (
    <PurchaseHistoryContext.Provider value={{ initialized: false, purchases, addPurchase }}>
      {children}
    </PurchaseHistoryContext.Provider>
  );
}

export function usePurchaseHistory() {
  const context = useContext(PurchaseHistoryContext);
  if (context === undefined) {
    throw new Error('usePurchaseHistory must be used within a PurchaseHistoryProvider');
  }
  return context;
}