'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/timetable', label: 'Timetable' },
  { href: '/map',       label: 'Campus Map' },
  { href: '/modules',   label: 'Modules' },
  { href: '/canteen',   label: 'Canteen' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 40px',
      display: 'flex',
      gap: '4px',
    }}>
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            fontSize: '14px', fontWeight: 500,
            color: active ? 'var(--text)' : 'var(--muted)',
            padding: '14px 20px',
            borderBottom: active ? '2px solid var(--text)' : '2px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
            letterSpacing: '-0.01em',
            display: 'inline-block',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>{label}</Link>
        );
      })}
    </nav>
  );
}
