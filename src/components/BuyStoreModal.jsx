'use client';

export default function BuyStoreModal({ book, isOpen, onClose }) {
  if (!isOpen || !book) return null;

  const buyLinks = Array.isArray(book.buy_links) ? book.buy_links : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-4 animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-200 border-2 border-stone-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-950 text-2xl font-black touch-target"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800">
            Select Your Preferred Merchant
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
            {book.title}
          </h3>
          <p className="text-2xl font-black text-slate-950 pt-0.5">{book.price}</p>
        </div>

        <p className="text-xs text-slate-700 leading-normal font-bold">
          Choose where you would like to complete your order. You will be redirected securely:
        </p>

        {/* Dynamic Store Links */}
        <div className="space-y-2.5 pt-1">
          {buyLinks.length > 0 ? (
            buyLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-stone-300 hover:border-amber-600 hover:bg-amber-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🛒</span>
                  <div>
                    <span className="font-black text-xs sm:text-sm text-slate-950 block group-hover:text-amber-800">
                      {link.platform}
                    </span>
                    {link.note && (
                      <span className="text-[11px] text-slate-600 font-bold block">
                        {link.note}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-black text-amber-800">Go →</span>
              </a>
            ))
          ) : (
            <div className="p-4 bg-stone-100 rounded-xl text-center text-xs font-bold text-slate-600">
              No specific store link attached yet. Please contact the author.
            </div>
          )}
        </div>

        <div className="pt-2 text-center border-t border-stone-100">
          <p className="text-[11px] text-slate-500 font-bold">🔒 100% Encrypted & Safe Checkout</p>
        </div>

      </div>
    </div>
  );
}
