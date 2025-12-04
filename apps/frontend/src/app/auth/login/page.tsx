'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        setError('Invalid access key');
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/personas';
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Access key"
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        autoFocus
      />
      {error && (
        <p className="text-xs text-red-500 text-left">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:opacity-90 disabled:opacity-50"
        disabled={loading || !key}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-xl font-semibold mb-2 text-gray-900 text-center">
          Sign in to Growth OS
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Internal JCER tool · enter your admin access key.
        </p>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}


