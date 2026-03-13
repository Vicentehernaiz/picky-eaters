'use client';

import { ReactNode, useEffect } from 'react';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  bottomSheet?: boolean;
}

export default function Modal({ open, onClose, title, children, bottomSheet = false }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'var(--color-overlay)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: bottomSheet ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: bottomSheet ? 0 : '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-white)',
          borderRadius: bottomSheet ? '24px 24px 0 0' : 'var(--radius-card)',
          width: '100%',
          maxWidth: bottomSheet ? undefined : '480px',
          boxShadow: 'var(--shadow-modal)',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: bottomSheet ? 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' : 'fadeIn 0.2s ease',
        }}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 20px 0',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-h3)',
              fontWeight: 700,
              color: 'var(--color-accent-orange)',
            }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: 'var(--color-bg-contrast)',
                border: 'none',
                borderRadius: '50%',
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
              }}
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        )}
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}
