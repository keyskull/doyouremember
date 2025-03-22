'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from './Toast';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const MAX_TOASTS = 5; // Increased max toasts

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => {
      // Remove oldest toasts if we exceed the maximum
      const newToasts = [...prev, { id, message, type }];
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(-MAX_TOASTS);
      }
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        className="fixed top-4 right-4 flex flex-col-reverse gap-3 z-50 max-h-[calc(100vh-2rem)] overflow-hidden pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col-reverse gap-3 pointer-events-auto">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 