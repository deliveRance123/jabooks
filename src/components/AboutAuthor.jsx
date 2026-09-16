'use client';

export default function AboutAuthor({ author, socialLinks }) {
  const name = author?.name || 'Joshua Adeoluwa';
  const bio = author?.bio || 'Joshua Adeoluwa is an author, strategist, and visionary teacher dedicated to equipping thinkers, leaders, and entrepreneurs to operate with clarity, unyielding discipline, and spiritual grounding.';
  const photoUrl = author?.photo_url || '/images/author-portrait.jpg';
  const links = Array.isArray(socialLinks) ? socialLinks : [];

  return (
    <section id="about" className="py-16 sm:py-24 bg-stone-200/60 border-t-2 border-b-2 border-stone-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main Author Bio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Author Portrait */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-950">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-64 h-72 sm:w-80 sm:h-96 object-cover object-top group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 text-white">
                  <p className="font-editorial text-xl font-black text-amber-200">{name}</p>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">Author & Strategic Thinker</p>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-2 bg-slate-950 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black shadow-xl border border-amber-500/50">
                ✍️ Published Author
              </div>
            </div>
          </div>

          {/* Bio Details */}
          <div className="md:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-500/30 text-amber-900 text-xs font-black uppercase tracking-widest">
              <span>Meet the Author</span>
            </div>
            
            <h2 className="font-editorial text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
              About {name}
            </h2>
            
            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-bold">
              {bio}
            </p>
            
            {/* Dynamic Social Links from Neon Database */}
            {links.length > 0 && (
              <div className="pt-3 border-t border-stone-300 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-black text-slate-900">
                <span className="text-slate-500 font-extrabold">Connect with {name.split(' ')[0]}:</span>
                {links.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-slate-900 hover:text-amber-800 transition shadow-sm"
                  >
                    {s.platform} ↗
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Visual Story & Authorship Showcase */}
        <div className="space-y-6 pt-6 border-t border-stone-300">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">Visual Journey</span>
            <h3 className="font-editorial text-2xl sm:text-4xl font-black text-slate-950">
              In the Study & the Craft
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-bold">
              A glimpse into the research, discipline, and physical publications driving the mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Photo 1: Author with Physical Book */}
            <div className="group bg-white rounded-2xl p-3 border-2 border-stone-300 shadow-md hover:shadow-xl transition space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/images/author-holding-book.jpg"
                  alt={`${name} holding his book`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="px-1 space-y-1">
                <h4 className="font-editorial text-lg font-black text-slate-950">The Published Book</h4>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  {name} holding the official verified publication, engineered to unlock human potential and strategic execution.
                </p>
              </div>
            </div>

            {/* Photo 2: Deep Study & Research */}
            <div className="group bg-white rounded-2xl p-3 border-2 border-stone-300 shadow-md hover:shadow-xl transition space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/images/author-reading.jpg"
                  alt={`${name} reading in the study`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="px-1 space-y-1">
                <h4 className="font-editorial text-lg font-black text-slate-950">Deep Research & Discipline</h4>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  Continuous immersion in business strategy, leadership, and timeless philosophy to formulate every chapter.
                </p>
              </div>
            </div>

            {/* Photo 3: The Library Collection */}
            <div className="group bg-white rounded-2xl p-3 border-2 border-stone-300 shadow-md hover:shadow-xl transition space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/images/books-stack.jpg"
                  alt="Curated literary library"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="px-1 space-y-1">
                <h4 className="font-editorial text-lg font-black text-slate-950">Lifelong Scholarship</h4>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  Extracting core principles from diverse libraries of wisdom to deliver concise, life-transforming books.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
