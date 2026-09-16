'use client';

import { useState, useMemo } from 'react';

export default function BookGrid({ books, author, onOpenDetails, onOpenBuy }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const authorName = author?.name || 'Joshua Adeoluwa';

  // Extract unique genres dynamically from books
  const genres = useMemo(() => {
    const set = new Set();
    books.forEach(b => {
      if (b.genre) set.add(b.genre);
    });
    return Array.from(set);
  }, [books]);

  // Filter books by search and genre
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchesGenre = selectedGenre === 'all' || b.genre === selectedGenre;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        b.title?.toLowerCase().includes(q) ||
        b.genre?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [books, selectedGenre, searchQuery]);

  return (
    <section id="catalog" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-stone-300">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-800">Published Works</span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-black text-slate-950 mt-1">
            Complete Books Library
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-bold mt-2 max-w-xl">
            Click any book to read what's inside, sample excerpts, reader feedback, and order directly.
          </p>
        </div>

        {/* Live Search */}
        <div className="w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title or topic..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-stone-300 text-sm text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Dynamic Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
        <button
          onClick={() => setSelectedGenre('all')}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs transition ${
            selectedGenre === 'all'
              ? 'font-black bg-slate-950 text-white shadow-sm'
              : 'font-extrabold bg-white text-slate-800 border-2 border-stone-300 hover:bg-stone-100'
          }`}
        >
          All Books ({books.length})
        </button>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs transition ${
              selectedGenre === genre
                ? 'font-black bg-slate-950 text-white shadow-sm'
                : 'font-extrabold bg-white text-slate-800 border-2 border-stone-300 hover:bg-stone-100'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-stone-300 p-8">
          <p className="text-lg font-bold text-slate-700">No books found matching your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedGenre('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-6">
          {filteredBooks.map((book) => {
            const takeaways = Array.isArray(book.takeaways) ? book.takeaways : [];
            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border-2 border-stone-300 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Book Mockup Cover Box */}
                  <div
                    onClick={() => onOpenDetails(book)}
                    className="cursor-pointer relative w-full h-64 sm:h-72 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-6 text-white text-center overflow-hidden mb-5 shadow group"
                  >
                    <div className="relative z-10 space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/30 px-3 py-1 rounded-full">
                        {book.genre}
                      </span>
                      <h4 className="font-editorial text-2xl sm:text-3xl font-black leading-tight text-white">
                        {book.title}
                      </h4>
                      {book.tagline && (
                        <p className="text-xs text-amber-200 font-bold">{book.tagline}</p>
                      )}
                      <p className="text-xs font-extrabold text-slate-300 pt-3">{authorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                      {book.is_featured ? '⭐ Featured Spotlight' : 'Official Edition'}
                    </span>
                    <span className="font-bold text-slate-800">★★★★★ (5.0)</span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl font-black text-slate-950 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-slate-700 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed font-semibold">
                    {book.description}
                  </p>

                  {/* Hook Bullets on Card */}
                  {takeaways.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-200 space-y-1.5 text-xs text-slate-800 font-bold">
                      {takeaways.slice(0, 3).map((t, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-emerald-800">
                          <span className="font-black">✓</span>
                          <span className="text-slate-900 font-bold">{t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Price & Buttons */}
                <div className="pt-5 border-t-2 border-stone-200 mt-5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">Official Price</span>
                    <span className="text-2xl font-black text-slate-950">{book.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDetails(book)}
                      className="touch-target px-4 py-2 rounded-xl border-2 border-stone-300 hover:bg-stone-100 text-slate-900 text-xs font-black"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onOpenBuy(book)}
                      className="touch-target px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition flex items-center gap-1 shadow"
                    >
                      <span>Buy</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
