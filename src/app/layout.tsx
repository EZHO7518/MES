import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'MES + ECOUNT MVP',
  description: 'MES quotation and producibility check app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
