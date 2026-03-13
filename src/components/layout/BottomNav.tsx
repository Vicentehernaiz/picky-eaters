'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, ListBullets, Camera, Users, User } from '@phosphor-icons/react';

const tabs = [
  { href: '/home',     icon: House,       label: 'Home'    },
  { href: '/my-list',  icon: ListBullets, label: 'My List' },
  { href: '/scan',     icon: Camera,      label: 'Scan',   center: true },
  { href: '/social',   icon: Users,       label: 'Social'  },
  { href: '/profile',  icon: User,        label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: 'var(--nav-height)',
      background: 'var(--color-bg-white)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 'var(--z-sticky)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = pathname.startsWith(tab.href);
        const color = active ? 'var(--color-accent-orange)' : 'var(--color-text-muted)';

        if (tab.center) {
          return (
            <Link key={tab.href} href={tab.href} style={{ textDecoration: 'none' }}>
              <div style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: active ? 'var(--color-accent-orange)' : '#1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.20)',
                marginBottom: 8,
                transition: 'var(--transition-fast)',
              }}>
                <Icon size={26} weight="fill" color="#fff" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
          >
            <Icon size={24} weight={active ? 'fill' : 'regular'} color={color} />
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: active ? 600 : 400,
              color,
              letterSpacing: '0.02em',
            }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
