'use client';

export default function BookDetailsModal({ book, isOpen, onClose, onOpenBuy }) {
  if (!isOpen || !book) return null;

  const takeaways = Array.isArray(book.takeaways) ? book.takeaways : [];
  const audience = Array.isArray(book.audience) ? book.audience : [];
  const buyLinks = Array.isArray(book.buy_links) ? book.buy_links : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-200 border-2 border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-950 text-3xl font-black touch-target z-10"
          aria-label="Close"
        >
          ✕
        </button>

        {/* 1. Header */}
        <div className="space-y-1.5 border-b-2 border-stone-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              {book.genre}
            </span>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Verified Edition
            </span>
            <span className="text-xs text-amber-500 font-black">★★★★★ 5.0 Rating</span>
          </div>
          <h3 className="font-editorial text-3xl sm:text-4xl font-black text-slate-950 pt-1 leading-tight">
            {book.title}
          </h3>
          {book.tagline && (
            <p className="text-sm font-bold text-amber-800">{book.tagline}</p>
          )}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-slate-950">{book.price}</span>
            <span className="text-xs font-black text-slate-400 uppercase">Available for Direct Order</span>
          </div>
        </div>

        {/* 2. Overview / Synopsis */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span>📖</span> The Big Promise & Synopsis
          </h4>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-bold">
            {book.description}
          </p>
        </div>

        {/* 3. Key Takeaways */}
        {takeaways.length > 0 && (
          <div className="bg-amber-50/90 rounded-2xl p-5 border-2 border-amber-200/80 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>🎯</span> Key Takeaways: What You Will Master
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-900 font-bold">
              {takeaways.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-800 font-black text-sm leading-none">✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Target Audience */}
        {audience.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>👥</span> Who This Book Was Written For:
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-extrabold">
              {audience.map((a, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-300 text-slate-800">
                  • {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Excerpt */}
        {book.sample_excerpt && (
          <div className="bg-stone-100 p-5 rounded-2xl border-2 border-stone-300 text-xs sm:text-sm leading-relaxed space-y-2 italic font-serif text-slate-900">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 not-italic block font-sans">
              Sample Chapter Excerpt:
            </span>
            <p className="font-bold">"{book.sample_excerpt}"</p>
          </div>
        )}

        {/* 6. Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-slate-500 block uppercase">Pages</span>
            <span className="font-black text-slate-950 text-sm">{book.pages || '250 Pages'}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-slate-500 block uppercase">Reading Time</span>
            <span className="font-black text-slate-950 text-sm">{book.reading_time || '~4 Hours'}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-slate-500 block uppercase">Category</span>
            <span className="font-black text-slate-950 text-sm">{book.genre}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-slate-500 block uppercase">Format</span>
            <span className="font-black text-slate-950 text-sm">Print + Digital</span>
          </div>
        </div>

        {/* 7. Dynamic Retailer Buttons */}
        <div className="space-y-3 pt-2 border-t-2 border-stone-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
              Ready to Own Your Copy? Select Store:
            </h4>
            <span className="text-xs text-emerald-700 font-extrabold">Instant Redirect</span>
          </div>
          
          {buyLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {buyLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target flex flex-col items-center justify-center p-3 rounded-xl border-2 border-stone-300 hover:border-amber-600 hover:bg-amber-50 transition font-black text-xs text-slate-950 shadow-sm text-center"
                >
                  <span className="font-black">{link.platform}</span>
                  {link.note && (
                    <span className="text-[10px] text-slate-500 font-semibold">{link.note}</span>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <button
              onClick={() => onOpenBuy(book)}
              className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-black text-sm shadow"
            >
              Order Now — {book.price}
            </button>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-black text-slate-500 hover:text-slate-900 underline"
          >
            Close Window
          </button>
          <button
            onClick={() => { onClose(); onOpenBuy(book); }}
            className="touch-target px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
}
