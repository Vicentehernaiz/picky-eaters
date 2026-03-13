'use client';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

function getInitials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getColor(name?: string) {
  const colors = ['#FE8F20', '#0D735A', '#CCDD20', '#FFBB00', '#D93025'];
  if (!name) return colors[0];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function Avatar({ src, name, size = 40 }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'avatar'}
        width={size}
        height={size}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: getColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: size * 0.38,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  );
}
