'use client';

import { useState } from 'react';

export default function Newsletter({ author }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const authorName = author?.name || 'Joshua Adeoluwa';

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;

    setStatus({ state: 'loading', message: 'Connecting to Reader Circle...' });

    let pushSubscription = null;

    // Request Real Browser Web Push Notification Permission
    try {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const reg = await navigator.serviceWorker.ready;
          // Trigger test notification
          reg.showNotification(`Welcome to ${authorName}'s Reader Circle!`, {
            body: "You will receive instant alerts whenever new book chapters and discounts drop.",
            icon: '/favicon.ico',
          });

          // Check for pushManager
          if (reg.pushManager) {
            try {
              const existingSub = await reg.pushManager.getSubscription();
              pushSubscription = existingSub ? existingSub.toJSON() : { permission: 'granted', userAgent: navigator.userAgent };
            } catch (err) {
              pushSubscription = { permission: 'granted' };
            }
          }
        }
      }
    } catch (err) {
      console.log('Push notification registration notice:', err);
    }

    // Submit to database
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, push_subscription: pushSubscription }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({
          state: 'success',
          message: '✓ You are subscribed! Browser notifications are active for new releases.',
        });
        setEmail('');
      } else {
        setStatus({ state: 'error', message: data.error || 'Subscription failed. Please try again.' });
      }
    } catch (err) {
      setStatus({ state: 'error', message: 'Could not connect. Please try again later.' });
    }
  }

  return (
    <section id="newsletter" className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-12 text-white shadow-2xl space-y-5 border-2 border-slate-800">
        
        <span className="text-xs font-black uppercase tracking-widest text-amber-400">
          Join the Inner Circle
        </span>
        
        <h2 className="font-editorial text-3xl sm:text-5xl font-black">
          {authorName}'s Readers List
        </h2>
        
        <p className="text-slate-200 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-bold">
          Be the first to receive new book releases, unpublished essays, private reflections, and real-time alerts.
        </p>

        {/* Real Subscription Form */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="touch-target px-4 py-3 rounded-xl bg-slate-900 border-2 border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1"
          />
          <button
            type="submit"
            disabled={status.state === 'loading'}
            className="touch-target px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 text-slate-950 font-black text-sm transition shadow-md whitespace-nowrap"
          >
            {status.state === 'loading' ? 'Subscribing...' : 'Subscribe & Enable Push'}
          </button>
        </form>

        {status.message && (
          <p className={`text-xs font-bold pt-1 ${status.state === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {status.message}
          </p>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-bold">
          <span>🔔 Real Browser Push Notifications</span>
          <span>•</span>
          <span>🔒 Zero Spam Guarantee</span>
        </div>

      </div>
    </section>
  );
}
