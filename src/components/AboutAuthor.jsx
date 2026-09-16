'use client';

export default function AboutAuthor({ author, socialLinks }) {
  const name = author?.name || 'Joshua Adeoluwa';
  const bio = author?.bio || '';
  const photoUrl = author?.photo_url;
  const initials = name.split(' ').map(n => n[0]).join('') || 'JA';
  const links = Array.isArray(socialLinks) ? socialLinks : [];

  return (
    <section id="about" className="py-16 sm:py-24 bg-stone-200/50 border-t-2 border-b-2 border-stone-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Author Portrait or Initials Badge */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl object-cover shadow-2xl border-4 border-white"
                />
              ) : (
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-br from-slate-950 to-amber-950 p-3 shadow-2xl border-4 border-white flex items-center justify-center text-center">
                  <div className="space-y-1">
                    <div className="w-16 h-16 rounded-full bg-amber-500/30 text-amber-400 mx-auto flex items-center justify-center font-editorial text-3xl font-black border-2 border-amber-400/50">
                      {initials}
                    </div>
                    <p className="font-editorial text-2xl font-black text-white pt-2">{name}</p>
                    <p className="text-[11px] uppercase tracking-widest text-amber-300 font-extrabold">Author & Thinker</p>
                  </div>
                </div>
              )}
              <div className="absolute -bottom-3 -right-2 bg-slate-950 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg border border-amber-500/40">
                ✍️ Published Author
              </div>
            </div>
          </div>

          {/* Bio Details */}
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">The Author</span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-black text-slate-950">
              About {name}
            </h2>
            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-bold">
              {bio}
            </p>
            
            {/* Dynamic Social Links from Neon Database */}
            {links.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-black text-slate-900">
                <span className="text-slate-500">Connect with {name.split(' ')[0]}:</span>
                {links.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-800 underline decoration-2 underline-offset-4"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
