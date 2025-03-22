'use client';

import { type ReactNode } from "react";
import { ToastProvider } from "@/components/ToastContext";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </HeroUIProvider>
  );
} 