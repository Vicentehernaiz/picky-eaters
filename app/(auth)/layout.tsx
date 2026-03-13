import { ReactNode } from 'react';
import { AuthProvider } from '@/src/context/AuthContext';
import { ToastProvider } from '@/src/components/ui/Toast';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
