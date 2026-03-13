'use client';

import { useAuth } from '@/src/context/AuthContext';
import Header from '@/src/components/layout/Header';
import PageWrapper from '@/src/components/layout/PageWrapper';
import Card from '@/src/components/ui/Card';
import Avatar from '@/src/components/ui/Avatar';
import Button from '@/src/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ShareNetwork, SignOut, Gear } from '@phosphor-icons/react';
import { useToast } from '@/src/components/ui/Toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'You';
  const username = user?.user_metadata?.username ?? 'me';
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${username}` : '';

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My Food Preferences', url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast('Profile link copied!', 'success');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <PageWrapper>
      <Header title="Profile" />

      <div style={{ padding: '24px 20px' }}>
        {/* Profile Header */}
        <Card style={{ padding: '24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Avatar name={displayName} size={72} />
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                color: 'var(--color-text-dark)', marginBottom: 2,
              }}>
                {displayName}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)' }}>
                @{username}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            borderTop: '1px solid var(--color-border)', paddingTop: 16,
          }}>
            {[
              { label: 'Foods rated', value: '—' },
              { label: 'Following', value: '—' },
              { label: 'Followers', value: '—' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-dark)' }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Share */}
        <Button variant="ghost" fullWidth onClick={handleShare} style={{ marginBottom: 12 }}>
          <ShareNetwork size={18} /> Share my food profile
        </Button>

        {/* Settings */}
        <Card style={{ padding: '4px 0', marginTop: 12 }}>
          {[
            { icon: Gear, label: 'Settings', action: () => {} },
            { icon: SignOut, label: 'Log out', action: handleLogout, danger: true },
          ].map(({ icon: Icon, label, action, danger }) => (
            <button
              key={label}
              onClick={action}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: label !== 'Log out' ? '1px solid var(--color-border)' : 'none',
                color: danger ? '#D93025' : 'var(--color-text-dark)',
              }}
            >
              <Icon size={20} color={danger ? '#D93025' : 'var(--color-text-body)'} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500 }}>
                {label}
              </span>
            </button>
          ))}
        </Card>
      </div>
    </PageWrapper>
  );
}
