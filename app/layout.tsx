import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'crit. — Real design feedback in 30 seconds',
  description:
    'Drop in a Figma file or screenshot. Crit scores it across clarity, hierarchy, trust, and conversion — and tells you exactly what to fix first.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
