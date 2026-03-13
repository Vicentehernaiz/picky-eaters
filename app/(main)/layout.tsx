import { ReactNode } from 'react';
import { AuthProvider } from '@/src/context/AuthContext';
import { ToastProvider } from '@/src/components/ui/Toast';
import BottomNav from '@/src/components/layout/BottomNav';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div style={{ minHeight: '100dvh', background: 'var(--color-bg-main)' }}>
          {children}
          <BottomNav />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
