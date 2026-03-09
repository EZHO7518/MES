'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Signup failed');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="card">
      <h1>Sign up</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div>
          <button type="submit">Sign up</button>
        </div>
      </form>
      {error && <p>{error}</p>}
      <Link href="/login">Back to login</Link>
    </div>
  );
}
