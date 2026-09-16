'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ author }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authorName = author?.name || 'Joshua Adeoluwa';
  const authorTagline = author?.tagline || 'Author & Strategic Thinker';
  const authorInitial = authorName.charAt(0) || 'J';

  return (
    <nav className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="#featured" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xl border-2 border-amber-500 shadow-sm group-hover:scale-105 transition">
            {authorInitial}
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 leading-none">
              {authorName}
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-amber-800 font-extrabold mt-1">
              {authorTagline}
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-800">
          <a href="#featured" className="hover:text-amber-700 transition">Featured Release</a>
          <a href="#catalog" className="hover:text-amber-700 transition">Book Library</a>
          <a href="#about" className="hover:text-amber-700 transition">About {authorName.split(' ')[0]}</a>
          <a href="#newsletter" className="hover:text-amber-700 transition">VIP Reader Club</a>
        </div>

        {/* Desktop CTA / Admin Link */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-800 hover:border-slate-900 hover:bg-white transition"
          >
            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Author Portal
          </Link>
          <a
            href="#catalog"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold shadow-md transition"
          >
            Explore All Books
          </a>
        </div>

        {/* Mobile Action & Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <a href="#catalog" className="px-3 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-sm">
            Books
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="touch-target w-11 h-11 rounded-xl bg-white border-2 border-stone-300 text-slate-900 flex items-center justify-center shadow-sm active:scale-95 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Hamburger Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-stone-300 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3 font-extrabold text-base text-slate-900">
            <a
              href="#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition"
            >
              📖 Featured Release
            </a>
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition"
            >
              📚 Complete Books Library
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition"
            >
              ✍️ About {authorName}
            </a>
            <a
              href="#newsletter"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition"
            >
              📬 VIP Reader Circle
            </a>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="touch-target w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 border border-stone-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Author Admin Portal
            </Link>
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="touch-target w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow"
            >
              Browse All Books Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
