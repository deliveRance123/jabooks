'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Incorrect password. (Hint: joshua)');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4">
      
      <div className="max-w-md w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
            JA
          </div>
          <h1 className="font-editorial text-3xl font-black text-white pt-2">
            Author Studio Login
          </h1>
          <p className="text-xs text-slate-400 font-bold">
            Enter your author password to manage books and readers.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
              Author Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="touch-target w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {error && (
            <p className="text-xs font-black text-rose-400 bg-rose-950/60 border border-rose-800 p-2.5 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="touch-target w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 text-slate-950 font-black text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Access Author Studio'}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-800">
          <Link href="/" className="text-xs text-slate-400 hover:text-white underline font-bold">
            ← Back to Public Website
          </Link>
        </div>

      </div>

    </div>
  );
}
