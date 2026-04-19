'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/timetable', label: 'Timetable' },
  { href: '/map',       label: 'Campus Map' },
  { href: '/modules',   label: 'Modules' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex',
    }}>
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            fontSize: '13px', fontWeight: 500,
            color: active ? 'var(--text)' : 'var(--muted)',
            padding: '12px 18px',
            borderBottom: active ? '2px solid var(--text)' : '2px solid transparent',
            transition: 'color 0.12s, border-color 0.12s',
            letterSpacing: '-0.01em',
            display: 'inline-block',
            textDecoration: 'none',
          }}>{label}</Link>
        );
      })}
    </nav>
  );
}
