'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from '@phosphor-icons/react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: { bg: '#E8F5F1', border: '#0D735A', icon: '#0D735A' },
    error:   { bg: '#FDECEA', border: '#D93025', icon: '#D93025' },
    info:    { bg: '#FEF3E8', border: '#FE8F20', icon: '#FE8F20' },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: 'calc(100% - 32px)',
        maxWidth: 400,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const Icon = icons[t.type];
          const c = colors[t.type];
          return (
            <div key={t.id} style={{
              background: c.bg,
              border: `1.5px solid ${c.border}`,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'all',
              animation: 'slideUp 0.3s ease',
            }}>
              <Icon size={20} weight="fill" color={c.icon} />
              <span style={{
                flex: 1,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-text-dark)',
              }}>{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-muted)', display: 'flex', padding: 2,
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be within ToastProvider');
  return ctx;
}
