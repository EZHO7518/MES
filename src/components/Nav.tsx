'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Nav() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="nav">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/products">Products</Link>
      <Link href="/quotations">Quotations</Link>
      <Link href="/checks">Checks</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
