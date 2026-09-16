'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import HeroFeatured from './HeroFeatured';
import BookGrid from './BookGrid';
import AboutAuthor from './AboutAuthor';
import Newsletter from './Newsletter';
import BookDetailsModal from './BookDetailsModal';
import BuyStoreModal from './BuyStoreModal';
import StickyMobileBar from './StickyMobileBar';

export default function HomeClient({ initialBooks, initialSettings }) {
  const [books] = useState(initialBooks || []);
  const [author] = useState(initialSettings?.author_profile || {
    name: 'Joshua Adeoluwa',
    tagline: 'Author & Strategic Thinker',
    bio: 'Joshua Adeoluwa is an author, strategist, and visionary teacher dedicated to equipping thinkers, leaders, and entrepreneurs to operate with clarity, unyielding discipline, and spiritual grounding.'
  });
  const [socialLinks] = useState(initialSettings?.social_links || []);

  const [detailsBook, setDetailsBook] = useState(null);
  const [buyBook, setBuyBook] = useState(null);

  const featuredBook = books.find(b => b.is_featured) || books[0];

  return (
    <>
      <Navbar author={author} />

      {featuredBook && (
        <HeroFeatured
          book={featuredBook}
          author={author}
          onOpenDetails={(b) => setDetailsBook(b)}
          onOpenBuy={(b) => setBuyBook(b)}
        />
      )}

      <BookGrid
        books={books}
        author={author}
        onOpenDetails={(b) => setDetailsBook(b)}
        onOpenBuy={(b) => setBuyBook(b)}
      />

      <AboutAuthor author={author} socialLinks={socialLinks} />

      <Newsletter author={author} />

      {/* Footer */}
      <footer className="border-t-2 border-stone-300 py-10 bg-white text-center text-xs text-slate-600 font-bold">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-editorial text-2xl text-slate-950 font-black">{author.name}</p>
          <p>© {new Date().getFullYear()} {author.name}. All rights reserved. Powered by Next.js & Neon PostgreSQL on Vercel.</p>
        </div>
      </footer>

      {/* Modals */}
      <BookDetailsModal
        book={detailsBook}
        isOpen={Boolean(detailsBook)}
        onClose={() => setDetailsBook(null)}
        onOpenBuy={(b) => setBuyBook(b)}
      />

      <BuyStoreModal
        book={buyBook}
        isOpen={Boolean(buyBook)}
        onClose={() => setBuyBook(null)}
      />

      {/* Sticky Bottom Bar on Mobile */}
      {featuredBook && (
        <StickyMobileBar
          book={featuredBook}
          onOpenBuy={(b) => setBuyBook(b)}
        />
      )}
    </>
  );
}
