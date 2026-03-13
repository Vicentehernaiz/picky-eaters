'use client';

import Header from '@/src/components/layout/Header';
import PageWrapper from '@/src/components/layout/PageWrapper';
import Card from '@/src/components/ui/Card';
import Avatar from '@/src/components/ui/Avatar';
import { MagnifyingGlass, UserPlus } from '@phosphor-icons/react';
import Input from '@/src/components/ui/Input';
import { useState } from 'react';

export default function SocialPage() {
  const [search, setSearch] = useState('');

  return (
    <PageWrapper>
      <Header title="Social 👥" />

      <div style={{ padding: '20px' }}>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<MagnifyingGlass size={18} />}
        />

        <div style={{ marginTop: 28 }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
            color: 'var(--color-text-muted)', letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            Discover Picky Eaters
          </h3>

          {/* Empty state */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '48px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--color-bg-contrast)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, fontSize: 36,
            }}>
              👥
            </div>
            <h4 style={{
              fontFamily: 'var(--font-ui)', fontSize: 17, fontWeight: 600,
              color: 'var(--color-text-dark)', marginBottom: 8,
            }}>
              Find your food crew
            </h4>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: 'var(--color-text-muted)', maxWidth: 260,
            }}>
              Search for friends by username and see what they love and hate eating.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
