'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/components/ui/Toast';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';

export default function RegisterPage() {
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName || !form.username || !form.email || !form.password) {
      toast('Please fill in all fields', 'error');
      return;
    }
    if (form.password.length < 6) {
      toast('Password must be at least 6 characters', 'error');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(form.username)) {
      toast('Username can only contain letters, numbers and underscores', 'error');
      return;
    }
    setLoading(true);
    const { error } = await register(form.email, form.password, form.username, form.displayName);
    setLoading(false);
    if (error) {
      toast(error, 'error');
    } else {
      toast('Account created! Check your email to confirm.', 'success');
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
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
          Join and share your food personality
        </p>
      </div>

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
          Create your account
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Display Name"
            type="text"
            placeholder="Jane Doe"
            value={form.displayName}
            onChange={set('displayName')}
            autoComplete="name"
          />
          <Input
            label="Username"
            type="text"
            placeholder="jane_doe"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
            autoComplete="username"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={set('password')}
            autoComplete="new-password"
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
            Create Account
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 20,
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--color-text-body)',
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-accent-green)', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>

    </div>
  );
}
