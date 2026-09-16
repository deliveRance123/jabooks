'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books'); // 'books', 'profile', 'subscribers'

  // Books State
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [genre, setGenre] = useState('Mindset & Habits');
  const [price, setPrice] = useState('$19.99');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState('250 Pages');
  const [readingTime, setReadingTime] = useState('~4 Hours');
  const [sampleExcerpt, setSampleExcerpt] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Dynamic Array Fields
  const [takeaways, setTakeaways] = useState(['', '', '']);
  const [audience, setAudience] = useState(['']);
  const [buyLinks, setBuyLinks] = useState([
    { platform: 'Amazon Global', url: '', note: 'Paperback & Kindle' },
    { platform: 'Selar / Paystack', url: '', note: 'Card & Bank Transfer' },
    { platform: 'Direct E-Book', url: '', note: 'Instant PDF / EPUB' }
  ]);

  // Profile & Socials State
  const [authorProfile, setAuthorProfile] = useState({ name: '', tagline: '', bio: '', photo_url: '' });
  const [socialLinks, setSocialLinks] = useState([]);

  // Subscribers State
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [recentSubscribers, setRecentSubscribers] = useState([]);

  // Message & Status
  const [feedback, setFeedback] = useState('');

  // 1. Check Auth & Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth');
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push('/admin/login');
          return;
        }

        // Fetch Books
        const booksRes = await fetch('/api/books');
        const booksData = await booksRes.json();
        if (booksData.success) setBooks(booksData.books);

        // Fetch Settings (Profile & Socials)
        const setRes = await fetch('/api/settings');
        const setData = await setRes.json();
        if (setData.success) {
          setAuthorProfile(setData.author_profile);
          setSocialLinks(setData.social_links || []);
        }

        // Fetch Subscribers
        const subRes = await fetch('/api/newsletter');
        const subData = await subRes.json();
        if (subData.success) {
          setSubscriberCount(subData.total_subscribers);
          setRecentSubscribers(subData.subscribers || []);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading admin data:', err);
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  // 2. Handle Logout
  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  // 3. Populate Form for Edit
  function startEditBook(b) {
    setEditingBookId(b.id);
    setTitle(b.title || '');
    setTagline(b.tagline || '');
    setGenre(b.genre || 'Mindset & Habits');
    setPrice(b.price || '$19.99');
    setCoverUrl(b.cover_url || '');
    setDescription(b.description || '');
    setPages(b.pages || '250 Pages');
    setReadingTime(b.reading_time || '~4 Hours');
    setSampleExcerpt(b.sample_excerpt || '');
    setIsFeatured(Boolean(b.is_featured));
    setTakeaways(Array.isArray(b.takeaways) && b.takeaways.length > 0 ? b.takeaways : ['']);
    setAudience(Array.isArray(b.audience) && b.audience.length > 0 ? b.audience : ['']);
    setBuyLinks(Array.isArray(b.buy_links) && b.buy_links.length > 0 ? b.buy_links : [{ platform: '', url: '', note: '' }]);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  // Reset Book Form
  function resetForm() {
    setEditingBookId(null);
    setTitle('');
    setTagline('');
    setGenre('Mindset & Habits');
    setPrice('$19.99');
    setCoverUrl('');
    setDescription('');
    setPages('250 Pages');
    setReadingTime('~4 Hours');
    setSampleExcerpt('');
    setIsFeatured(false);
    setTakeaways(['', '', '']);
    setAudience(['']);
    setBuyLinks([
      { platform: 'Amazon Global', url: '', note: 'Paperback & Kindle' },
      { platform: 'Selar / Paystack', url: '', note: 'Card & Bank Transfer' },
      { platform: 'Direct E-Book', url: '', note: 'Instant PDF / EPUB' }
    ]);
  }

  // 4. Save Book (Create or Update)
  async function handleSaveBook(e) {
    e.preventDefault();
    setFeedback('Saving book...');

    const cleanTakeaways = takeaways.filter(t => t.trim() !== '');
    const cleanAudience = audience.filter(a => a.trim() !== '');
    const cleanBuyLinks = buyLinks.filter(l => l.platform.trim() !== '' && l.url.trim() !== '');

    const payload = {
      title,
      tagline,
      genre,
      price,
      cover_url: coverUrl,
      description,
      pages,
      reading_time: readingTime,
      sample_excerpt: sampleExcerpt,
      is_featured: isFeatured,
      takeaways: cleanTakeaways,
      audience: cleanAudience,
      buy_links: cleanBuyLinks
    };

    try {
      const url = editingBookId ? `/api/books/${editingBookId}` : '/api/books';
      const method = editingBookId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setFeedback('✓ Book saved successfully!');
        resetForm();

        // Refresh book list
        const booksRes = await fetch('/api/books');
        const booksData = await booksRes.json();
        if (booksData.success) setBooks(booksData.books);
      } else {
        setFeedback('Error: ' + (data.error || 'Failed to save book'));
      }
    } catch (err) {
      setFeedback('Error saving book: ' + err.message);
    }
  }

  // 5. Delete Book
  async function handleDeleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBooks(books.filter(b => b.id !== id));
        if (editingBookId === id) resetForm();
      }
    } catch (err) {
      alert('Delete failed');
    }
  }

  // 6. Save Profile & Socials
  async function handleSaveSettings(e) {
    e.preventDefault();
    setFeedback('Saving author settings...');

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'author_profile', value: authorProfile })
      });

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'social_links', value: socialLinks.filter(s => s.platform && s.url) })
      });

      setFeedback('✓ Author profile and social links updated!');
    } catch (err) {
      setFeedback('Failed to update settings');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">
        Loading Author Studio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Studio Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
            JA
          </span>
          <div>
            <h2 className="font-extrabold text-white text-sm">Joshua Adeoluwa — Author Studio</h2>
            <p className="text-xs text-slate-400 font-semibold">Neon PostgreSQL Connected • Vercel Ready</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="touch-target px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-200 transition flex items-center gap-1.5 border border-slate-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <span>Live Site ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="touch-target px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-black transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Studio Tabs */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('books'); setFeedback(''); }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              activeTab === 'books'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            📚 Manage Books ({books.length})
          </button>
          
          <button
            onClick={() => { setActiveTab('profile'); setFeedback(''); }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            ✍️ Author Bio & Social Links
          </button>

          <button
            onClick={() => { setActiveTab('subscribers'); setFeedback(''); }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            🔔 Readers & Push ({subscriberCount})
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-black">
            {feedback}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: MANAGE BOOKS */}
        {/* ========================================================================= */}
        {activeTab === 'books' && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Add / Edit Book Form */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-white text-base">
                      {editingBookId ? 'Edit Book' : 'Post a New Book'}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold">
                      Add your book details, takeaways, and dynamic seller links.
                    </p>
                  </div>
                  {editingBookId && (
                    <button
                      onClick={resetForm}
                      className="text-xs font-black text-amber-400 hover:underline"
                    >
                      + Cancel & New Book
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveBook} className="space-y-4 text-xs sm:text-sm font-bold">
                  
                  <div>
                    <label className="block text-slate-300 mb-1">Book Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Architecture of Purpose"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Mastering Life, Vision & Generational Legacy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Genre / Category *</label>
                      <input
                        type="text"
                        required
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="e.g. Mindset, Leadership, Faith"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Price Tag *</label>
                      <input
                        type="text"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. $19.99 or ₦15,000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description / Big Promise *</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this book about? Why must the reader buy it?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Dynamic Selling Market Platforms */}
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-amber-400">
                        Selling Platforms & Buy Links (Zero Hardcoded)
                      </label>
                      <button
                        type="button"
                        onClick={() => setBuyLinks([...buyLinks, { platform: '', url: '', note: '' }])}
                        className="text-xs font-black text-amber-400 hover:text-amber-300 underline"
                      >
                        + Add Another Merchant
                      </button>
                    </div>

                    {buyLinks.map((link, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <input
                          type="text"
                          placeholder="Platform Name (e.g. Amazon, Selar, Paystack, Gumroad)"
                          value={link.platform}
                          onChange={(e) => {
                            const copy = [...buyLinks];
                            copy[idx].platform = e.target.value;
                            setBuyLinks(copy);
                          }}
                          className="sm:col-span-4 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                        />
                        <input
                          type="url"
                          placeholder="Purchase Link (https://...)"
                          value={link.url}
                          onChange={(e) => {
                            const copy = [...buyLinks];
                            copy[idx].url = e.target.value;
                            setBuyLinks(copy);
                          }}
                          className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Format Note (e.g. Kindle, Print)"
                          value={link.note || ''}
                          onChange={(e) => {
                            const copy = [...buyLinks];
                            copy[idx].note = e.target.value;
                            setBuyLinks(copy);
                          }}
                          className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setBuyLinks(buyLinks.filter((_, i) => i !== idx))}
                          className="sm:col-span-1 text-rose-400 hover:text-rose-300 text-center font-black"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Key Takeaways */}
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-amber-400">
                        Key Takeaways / Bullet Points
                      </label>
                      <button
                        type="button"
                        onClick={() => setTakeaways([...takeaways, ''])}
                        className="text-xs font-black text-amber-400 hover:text-amber-300 underline"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    {takeaways.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-400 font-black">✓</span>
                        <input
                          type="text"
                          placeholder={`Key lesson ${idx + 1} taught in this book...`}
                          value={t}
                          onChange={(e) => {
                            const copy = [...takeaways];
                            copy[idx] = e.target.value;
                            setTakeaways(copy);
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                        />
                        {takeaways.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setTakeaways(takeaways.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300 font-bold px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sample Excerpt */}
                  <div>
                    <label className="block text-slate-300 mb-1">Sample Chapter Excerpt</label>
                    <textarea
                      rows={2}
                      value={sampleExcerpt}
                      onChange={(e) => setSampleExcerpt(e.target.value)}
                      placeholder="An inspiring passage from the first chapter..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Page Count</label>
                      <input
                        type="text"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        placeholder="e.g. 264 Pages"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Estimated Reading Time</label>
                      <input
                        type="text"
                        value={readingTime}
                        onChange={(e) => setReadingTime(e.target.value)}
                        placeholder="e.g. ~4.5 Hours"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* Featured Spotlight Toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isFeaturedToggle"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                    />
                    <label htmlFor="isFeaturedToggle" className="text-slate-200 text-xs font-black cursor-pointer">
                      ⭐ Pin as Top Featured Spotlight on Homepage
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex items-center gap-3">
                    <button
                      type="submit"
                      className="touch-target px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>{editingBookId ? 'Update Book' : 'Publish Book to Website'}</span>
                    </button>

                    {editingBookId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="touch-target px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* Right: Live Reader Preview Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Live Synchronized Preview
                  </span>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-black">
                    Real-Time
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-2xl">
                  
                  <div className="w-full h-64 rounded-2xl bg-gradient-to-tr from-amber-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 text-white text-center shadow mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                        {genre || 'Genre'}
                      </span>
                      <h4 className="font-editorial text-2xl font-black leading-tight text-white">
                        {title || 'Your Book Title'}
                      </h4>
                      {tagline && (
                        <p className="text-xs text-amber-200 font-bold">{tagline}</p>
                      )}
                      <p className="text-xs text-slate-300 font-extrabold pt-2">
                        {authorProfile.name || 'Joshua Adeoluwa'}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-editorial text-2xl font-black text-white">
                    {title || 'Book Title'}
                  </h3>
                  <p className="text-slate-300 text-xs mt-2 line-clamp-3 leading-relaxed font-bold">
                    {description || 'Book summary and synopsis will appear here...'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-xs text-slate-300 font-bold">
                    {takeaways.filter(t => t.trim()).slice(0, 3).map((t, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-emerald-400">
                        <span>✓</span>
                        <span className="text-slate-300 font-bold">{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold">Price</span>
                      <span className="text-xl font-black text-amber-400">{price || '$0.00'}</span>
                    </div>
                    <span className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow">
                      Buy Book
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Published Books Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
              <h3 className="font-black text-white text-base">
                Published Books in Database ({books.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-800 text-slate-400 font-black">
                    <tr>
                      <th className="pb-3">Book Title</th>
                      <th className="pb-3">Genre</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Selling Platforms</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-bold">
                    {books.map(b => {
                      const links = Array.isArray(b.buy_links) ? b.buy_links : [];
                      return (
                        <tr key={b.id}>
                          <td className="py-3.5 font-black text-white">{b.title}</td>
                          <td className="py-3.5 text-slate-400">{b.genre}</td>
                          <td className="py-3.5 text-amber-400 font-black">{b.price}</td>
                          <td className="py-3.5 text-slate-400">
                            {links.map(l => l.platform).join(', ') || 'None'}
                          </td>
                          <td className="py-3.5">
                            {b.is_featured ? (
                              <span className="px-2.5 py-1 rounded text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                ⭐ Hero Spotlight
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded text-[11px] font-black bg-slate-800 text-slate-400">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => startEditBook(b)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-black text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AUTHOR PROFILE & DYNAMIC SOCIAL LINKS */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">Author Profile & Social Links</h3>
              <p className="text-xs text-slate-400 font-bold">
                Zero hardcoded socials. Update your biography and public connection links anytime.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm font-bold">
              <div>
                <label className="block text-slate-300 mb-1">Author Full Name</label>
                <input
                  type="text"
                  value={authorProfile.name}
                  onChange={(e) => setAuthorProfile({ ...authorProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Author Headline / Tagline</label>
                <input
                  type="text"
                  value={authorProfile.tagline}
                  onChange={(e) => setAuthorProfile({ ...authorProfile, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Biography / About Author</label>
                <textarea
                  rows={4}
                  value={authorProfile.bio}
                  onChange={(e) => setAuthorProfile({ ...authorProfile, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Author Portrait Photo URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://... (leave empty to use initials badge)"
                  value={authorProfile.photo_url || ''}
                  onChange={(e) => setAuthorProfile({ ...authorProfile, photo_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              {/* Dynamic Social Links */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-400">
                    Social Media & Contact Links
                  </label>
                  <button
                    type="button"
                    onClick={() => setSocialLinks([...socialLinks, { platform: '', url: '' }])}
                    className="text-xs font-black text-amber-400 underline"
                  >
                    + Add Link
                  </button>
                </div>

                {socialLinks.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Platform (e.g. Twitter / X, LinkedIn)"
                      value={s.platform}
                      onChange={(e) => {
                        const copy = [...socialLinks];
                        copy[idx].platform = e.target.value;
                        setSocialLinks(copy);
                      }}
                      className="w-1/3 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="URL (https://... or mailto:...)"
                      value={s.url}
                      onChange={(e) => {
                        const copy = [...socialLinks];
                        copy[idx].url = e.target.value;
                        setSocialLinks(copy);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== idx))}
                      className="text-rose-400 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="touch-target px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition"
                >
                  Save Profile & Social Links
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: READERS & BROWSER PUSH NOTIFICATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'subscribers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">VIP Readers & Browser Push Notifications</h3>
              <p className="text-xs text-slate-400 font-bold">
                Real subscriber list stored in your Neon database.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">Total VIP Subscribers</span>
                <span className="text-3xl font-black text-amber-400">{subscriberCount}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ● Web Push Active
              </span>
            </div>

            {/* Test Browser Push Notification directly */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <h4 className="text-xs font-black uppercase text-amber-400">Test Push Notification on This Device</h4>
              <p className="text-xs text-slate-300 font-bold">
                Click below to send a live test notification through the registered service worker.
              </p>
              <button
                onClick={() => {
                  if ('Notification' in window) {
                    Notification.requestPermission().then(perm => {
                      if (perm === 'granted' && navigator.serviceWorker) {
                        navigator.serviceWorker.ready.then(reg => {
                          reg.showNotification("Joshua Adeoluwa — Author Studio Alert", {
                            body: "Test notification: Web Push is operational across your subscriber network!",
                            icon: '/favicon.ico'
                          });
                        });
                      } else {
                        alert('Please allow notifications in your browser settings to test.');
                      }
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow"
              >
                Send Test Notification Now
              </button>
            </div>

            {/* Recent Subscribers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Recent Reader Subscriptions
              </h4>
              {recentSubscribers.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold">No subscribers yet.</p>
              ) : (
                <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl p-4 border border-slate-800">
                  {recentSubscribers.map(sub => (
                    <div key={sub.id} className="py-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{sub.email || 'Anonymous Push Device'}</span>
                      <span className="text-slate-500 text-[11px] font-bold">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
