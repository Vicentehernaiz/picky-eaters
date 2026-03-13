'use client';

import { useAuth } from '@/src/context/AuthContext';
import Header from '@/src/components/layout/Header';
import PageWrapper from '@/src/components/layout/PageWrapper';
import Card from '@/src/components/ui/Card';
import Avatar from '@/src/components/ui/Avatar';
import { ArrowRight, Users, Sparkle } from '@phosphor-icons/react';
import Link from 'next/link';

const quickActions = [
  { href: '/my-list',  emoji: '🥗', label: 'My Food List',      desc: 'Rate your foods'          },
  { href: '/scan',     emoji: '📷', label: 'Scan a Dish',        desc: 'ID ingredients with AI'   },
  { href: '/social',   emoji: '👥', label: 'Explore Friends',    desc: 'See what they love'        },
];

export default function HomePage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'there';

  return (
    <PageWrapper>
      <Header title="Picky Eaters 🥑" showNotifications />

      <div style={{ padding: '20px 20px 0' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Avatar name={displayName} size={48} />
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
              Good {getGreeting()} 👋
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text-dark)',
              lineHeight: 1.2,
            }}>
              {displayName}
            </h2>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Quick Actions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {quickActions.map(({ href, emoji, label, desc }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <Card style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                transition: 'var(--transition-fast)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--color-bg-main)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0,
                }}>
                  {emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600,
                    color: 'var(--color-text-dark)', marginBottom: 2,
                  }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {desc}
                  </p>
                </div>
                <ArrowRight size={18} color="var(--color-text-muted)" />
              </Card>
            </Link>
          ))}
        </div>

        {/* AI Suggestions Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-accent-orange), #ff6b35)',
          borderRadius: 'var(--radius-card)',
          padding: '20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <Sparkle size={32} weight="fill" color="#fff" />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              AI Food Suggestions
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
              Rate more foods to unlock personalized suggestions
            </p>
          </div>
          <Link href="/my-list" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 8, padding: '6px 12px',
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: '#fff',
            }}>
              Rate →
            </div>
          </Link>
        </div>

        {/* Social CTA */}
        <Card style={{ padding: '20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Users size={24} color="var(--color-accent-orange)" weight="fill" />
            <h3 style={{
              fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700,
              color: 'var(--color-text-dark)',
            }}>
              Plan meals with friends
            </h3>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-body)', marginBottom: 14 }}>
            Share your food list, find restaurants everyone loves, and plan group meals with AI.
          </p>
          <Link href="/social" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
              color: 'var(--color-accent-orange)',
            }}>
              Find friends <ArrowRight size={16} />
            </div>
          </Link>
        </Card>
      </div>
    </PageWrapper>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
