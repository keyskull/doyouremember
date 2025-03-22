'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 4700);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-500/90 dark:bg-green-600/90 text-white border-green-600/20 dark:border-green-500/20',
    error: 'bg-red-500/90 dark:bg-red-600/90 text-white border-red-600/20 dark:border-red-500/20',
    warning: 'bg-yellow-500/90 dark:bg-yellow-600/90 text-white border-yellow-600/20 dark:border-yellow-500/20',
    info: 'bg-blue-500/90 dark:bg-blue-600/90 text-white border-blue-600/20 dark:border-blue-500/20'
  };

  const progressBarColors = {
    success: 'bg-green-400/50 dark:bg-green-500/50',
    error: 'bg-red-400/50 dark:bg-red-500/50',
    warning: 'bg-yellow-400/50 dark:bg-yellow-500/50',
    info: 'bg-blue-400/50 dark:bg-blue-500/50'
  };

  return (
    <div
      className={`relative flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${
        styles[type]
      } ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
    >
      <div className="flex items-center gap-2 min-w-[200px] max-w-[400px]">
        <span className="shrink-0">{icons[type]}</span>
        <p className="text-sm font-medium pr-6 line-clamp-2">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 p-1.5 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg overflow-hidden bg-black/5 dark:bg-white/5">
        <div
          className={`h-full ${progressBarColors[type]}`}
          style={{
            animation: 'progress 5s linear forwards'
          }}
        />
      </div>
    </div>
  );
} 