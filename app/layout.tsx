import type { Metadata } from 'next';
import '@/styles/globals.css';
import Topbar from '@/components/Topbar';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Campus Companion',
  description: 'Your TU Dublin student dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
