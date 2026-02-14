'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import React from 'react';
import clsx from 'clsx';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

let nextId = 0;

const icons: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u2717',
  info: '\u2139',
};

const styles: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return React.createElement(
    ToastContext.Provider,
    { value: { toast: addToast } },
    children,
    React.createElement(
      'div',
      { className: 'fixed bottom-4 right-4 z-50 flex flex-col gap-2' },
      toasts.map((t) =>
        React.createElement(
          'div',
          {
            key: t.id,
            className: clsx('flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] animate-slide-up', styles[t.type]),
          },
          React.createElement('span', { className: 'text-lg' }, icons[t.type]),
          React.createElement('p', { className: 'text-sm font-medium flex-1' }, t.message),
          React.createElement(
            'button',
            { onClick: () => remove(t.id), className: 'text-current opacity-50 hover:opacity-100' },
            '\u00D7'
          )
        )
      )
    )
  );
}

export function useToast() {
  return useContext(ToastContext);
}
