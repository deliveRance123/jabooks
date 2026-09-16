'use client';

export default function StickyMobileBar({ book, onOpenBuy }) {
  if (!book) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t-2 border-slate-800 p-3 px-4 flex items-center justify-between shadow-2xl">
      <div className="truncate mr-3">
        <span className="text-[10px] text-amber-400 font-black block uppercase tracking-wider">Top Book</span>
        <span className="text-xs font-black text-white truncate block">{book.title}</span>
      </div>
      <button
        onClick={() => onOpenBuy(book)}
        className="touch-target px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap shadow"
      >
        Buy {book.price}
      </button>
    </div>
  );
}
