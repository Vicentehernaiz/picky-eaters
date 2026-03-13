'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/components/ui/Toast';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) {
      toast(error, 'error');
    } else {
      router.push('/home');
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--color-bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>
      {/* App Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 42,
          fontWeight: 800,
          color: 'var(--color-accent-orange)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: 8,
        }}>
          Picky Eaters 🥑
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          color: 'var(--color-text-muted)',
        }}>
          Your food preferences, shared with friends
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--color-bg-white)',
        borderRadius: 'var(--radius-card)',
        padding: '32px 24px',
        width: '100%',
        maxWidth: 420,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--color-text-dark)',
          marginBottom: 24,
        }}>
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                {showPass ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button type="submit" loading={loading} fullWidth style={{ marginTop: 8 }}>
            Log in
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 20,
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--color-text-body)',
        }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{
              color: 'var(--color-accent-green)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </p>
      </div>

    </div>
  );
}
