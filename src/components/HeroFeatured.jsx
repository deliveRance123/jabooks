'use client';

export default function HeroFeatured({ book, author, onOpenDetails, onOpenBuy }) {
  if (!book) return null;

  const authorName = author?.name || 'Joshua Adeoluwa';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('') || 'JA';
  const buyLinks = Array.isArray(book.buy_links) ? book.buy_links : [];
  const takeaways = Array.isArray(book.takeaways) ? book.takeaways : [];

  return (
    <section id="featured" className="relative overflow-hidden py-10 sm:py-20 border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Mobile Cover: Displays First on Mobile Screens */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center py-4">
            <div className="relative group cursor-pointer" onClick={() => onOpenDetails(book)}>
              {/* Backlight Halo */}
              <div className="absolute -inset-4 bg-amber-500/25 rounded-full blur-2xl group-hover:bg-amber-500/35 transition duration-500"></div>
              
              {/* 3D Realistic Book Cover */}
              <div className="relative book-realistic w-60 sm:w-72 md:w-80 h-84 sm:h-[440px] rounded-r-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 flex flex-col justify-between border-y border-r border-slate-700/60">
                <div className="book-spine-line absolute left-0 top-0 bottom-0 w-3.5"></div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded text-[11px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 shadow">
                    Featured Masterwork
                  </span>
                  <h3 className="font-editorial text-3xl sm:text-4xl font-black leading-tight pt-2 text-white">
                    {book.title}
                  </h3>
                  {book.tagline && (
                    <p className="text-xs sm:text-sm text-amber-200 font-bold tracking-wide">
                      {book.tagline}
                    </p>
                  )}
                </div>

                <div className="my-auto flex justify-center py-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/40 flex items-center justify-center p-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-amber-300/80 flex items-center justify-center text-amber-400 font-editorial text-2xl font-black">
                      {authorInitials}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold block">Author</span>
                    <span className="font-editorial text-lg sm:text-xl font-black text-amber-100">{authorName}</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 bg-amber-500/30 px-2.5 py-1 rounded">
                    {book.genre}
                  </span>
                </div>
              </div>

              <p className="text-center text-xs text-slate-600 font-black mt-3 flex items-center justify-center gap-1">
                <span>📖 Tap cover for full breakdown & sample excerpt</span>
              </p>

              {/* Author Verified Badge */}
              <div className="mt-4 flex items-center gap-3 bg-white/95 p-3 rounded-2xl border-2 border-stone-300 shadow-md max-w-xs mx-auto">
                <img
                  src="/images/author-holding-book.jpg"
                  alt={`${authorName} with published book`}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow flex-shrink-0"
                />
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">Verified Author Edition</span>
                  <p className="text-xs font-black text-slate-950 leading-tight">{authorName}</p>
                  <p className="text-[10px] text-slate-500 font-bold">Physical Print & Digital Master</p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Bold Copy & Real Conversion Actions */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-600/40 text-amber-950 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping"></span>
              #1 Bestseller & Official Campaign Release
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.12]">
              Stop wandering through life. <br className="hidden sm:inline" />
              <span className="text-amber-800 underline decoration-amber-400/60 decoration-4">Build what outlasts you.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold">
              {book.description}
            </p>

            {/* Quick Takeaway Bullets */}
            {takeaways.length > 0 && (
              <div className="bg-amber-50/90 border-2 border-amber-200/80 rounded-2xl p-4 space-y-2 text-xs sm:text-sm font-bold text-slate-900">
                <p className="text-[11px] font-black uppercase tracking-wider text-amber-800">What Readers Experience Inside:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {takeaways.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black text-base leading-none">✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-900 text-xs sm:text-sm font-bold">
              <div className="flex text-amber-500 text-base">★★★★★</div>
              <span className="font-black text-slate-950">5.0 / 5.0 (480+ Verified Reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-extrabold">{book.pages || '250+ Pages'}</span>
            </div>

            {/* Author Note */}
            <div className="flex items-center gap-3.5 p-3.5 bg-amber-100/70 border border-amber-300/80 rounded-2xl">
              <img
                src="/images/author-portrait.jpg"
                alt={authorName}
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-sm flex-shrink-0"
              />
              <div className="text-xs font-bold text-slate-900 leading-snug">
                <span className="font-extrabold text-slate-950 block">{authorName} &middot; Author Statement:</span>
                &ldquo;Every principle in this book was distilled from disciplined study and real-world execution to elevate your focus.&rdquo;
              </div>
            </div>

            {/* Pricing & CTA Card */}
            <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-md space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">Special Campaign Price</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">{book.price}</span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      OFFICIAL EDITION
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-600 font-bold hidden sm:block">⚡ Instant Global Delivery</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => onOpenBuy(book)}
                  className="touch-target px-6 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base shadow-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <span>Buy Now — {book.price}</span>
                </button>
                <button
                  onClick={() => onOpenDetails(book)}
                  className="touch-target px-5 py-4 rounded-xl border-2 border-slate-950 text-slate-950 font-black text-sm hover:bg-slate-950 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>See Full Book Details</span>
                </button>
              </div>

              {/* Dynamic Selling Platforms from Database */}
              {buyLinks.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-700 font-bold">
                  <span>Available at:</span>
                  {buyLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 font-extrabold text-slate-900 border border-slate-200 transition"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
