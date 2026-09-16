'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books'); // 'books', 'profile', 'subscribers'
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [authorProfile, setAuthorProfile] = useState({ name: 'Joshua Adeoluwa', tagline: '', bio: '', photo_url: '' });
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

        // Fetch Settings
        const setRes = await fetch('/api/settings');
        const setData = await setRes.json();
        if (setData.success) {
          setAuthorProfile(setData.author_profile || { name: 'Joshua Adeoluwa', tagline: '', bio: '', photo_url: '' });
          setSocialLinks(setData.social_links || []);
        }

        // Fetch Subscribers
        const subRes = await fetch('/api/newsletter');
        const subData = await subRes.json();
        if (subData.success) {
          setSubscriberCount(subData.total_subscribers || 0);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center font-bold">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-amber-500 animate-ping"></span>
          <span>Loading Author Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans flex flex-col lg:flex-row antialiased">
      
      {/* ========================================================================= */}
      {/* DESKTOP & MOBILE SIDEBAR NAVIGATION */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0C101D] border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-7">
          
          {/* Studio Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-base shadow-lg shadow-amber-500/20">
                JA
              </div>
              <div className="truncate">
                <h1 className="font-extrabold text-white text-sm tracking-tight truncate">
                  {authorProfile.name || 'Joshua Adeoluwa'}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mt-0.5">
                  Author Studio
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white text-xl font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1.5 font-bold text-xs">
            
            <button
              onClick={() => { setActiveTab('books'); setFeedback(''); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
                activeTab === 'books'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Manage Books</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'books' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {books.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setFeedback(''); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>Author Bio & Socials</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'profile' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {socialLinks.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('subscribers'); setFeedback(''); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
                activeTab === 'subscribers'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span>Readers & Web Push</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'subscribers' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {subscriberCount}
              </span>
            </button>

            <div className="pt-4 border-t border-slate-800/70">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  <span>View Public Website</span>
                </div>
                <span className="text-slate-500 text-xs">↗</span>
              </Link>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-800/80 bg-[#090D18] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-slate-300">Neon Postgres</span>
            </div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Vercel Ready
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 text-xs font-black transition flex items-center justify-center gap-2 border border-slate-700/80"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 lg:ml-72 flex flex-col min-h-screen">
        
        {/* Top Content Header Bar */}
        <header className="sticky top-0 z-30 bg-[#070A12]/90 backdrop-blur border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger trigger on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden touch-target w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 active:scale-95 transition"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div>
              <h2 className="font-black text-white text-base sm:text-lg tracking-tight">
                {activeTab === 'books' && 'Book Management & Publishing'}
                {activeTab === 'profile' && 'Author Biography & Social Links'}
                {activeTab === 'subscribers' && 'VIP Readers & Web Push Audience'}
              </h2>
              <p className="text-xs text-slate-400 font-semibold hidden sm:block">
                All changes synchronize directly with your live Neon PostgreSQL database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-200 transition border border-slate-700"
            >
              <span>Live Website ↗</span>
            </Link>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Admin Active
            </span>
          </div>
        </header>

        {/* Dynamic Feedback Banner */}
        {feedback && (
          <div className="mx-4 sm:mx-8 mt-6 p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500/50 text-amber-300 text-xs font-black flex items-center justify-between shadow-lg">
            <span>{feedback}</span>
            <button onClick={() => setFeedback('')} className="text-amber-400 font-black">✕</button>
          </div>
        )}

        {/* Main Workspace Body */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: MANAGE BOOKS */}
          {/* ========================================================================= */}
          {activeTab === 'books' && (
            <div className="space-y-8">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0C101D] border border-slate-800/90 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">Total Books</span>
                  <span className="text-2xl font-black text-white mt-0.5 block">{books.length}</span>
                </div>
                <div className="bg-[#0C101D] border border-slate-800/90 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">Hero Spotlight</span>
                  <span className="text-xs font-black text-amber-400 mt-2 block truncate">
                    {books.find(b => b.is_featured)?.title || 'None Selected'}
                  </span>
                </div>
                <div className="bg-[#0C101D] border border-slate-800/90 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">VIP Readers</span>
                  <span className="text-2xl font-black text-amber-400 mt-0.5 block">{subscriberCount}</span>
                </div>
                <div className="bg-[#0C101D] border border-slate-800/90 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">Database Engine</span>
                  <span className="text-xs font-black text-emerald-400 mt-2 block">● Neon Serverless</span>
                </div>
              </div>

              {/* Form + Live Preview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form to Post / Edit Book */}
                <div className="lg:col-span-7 bg-[#0C101D] border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-white text-base">
                        {editingBookId ? 'Edit Book' : 'Post a New Book'}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold">
                        Fill in details below; updates directly to your live database.
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Mastering Life, Vision & Generational Legacy"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Dynamic Selling Market Platforms */}
                    <div className="bg-[#080B14] p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black uppercase tracking-wider text-amber-400">
                          Selling Platforms & Buy Links (Zero Hardcoded)
                        </label>
                        <button
                          type="button"
                          onClick={() => setBuyLinks([...buyLinks, { platform: '', url: '', note: '' }])}
                          className="text-xs font-black text-amber-400 hover:text-amber-300 underline"
                        >
                          + Add Merchant
                        </button>
                      </div>

                      {buyLinks.map((link, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                          <input
                            type="text"
                            placeholder="Platform (Amazon, Selar, Paystack, Gumroad)"
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
                            placeholder="Link (https://...)"
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
                            placeholder="Format (Kindle, Print)"
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
                    <div className="bg-[#080B14] p-4 rounded-2xl border border-slate-800 space-y-2">
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
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">Estimated Reading Time</label>
                        <input
                          type="text"
                          value={readingTime}
                          onChange={(e) => setReadingTime(e.target.value)}
                          placeholder="e.g. ~4.5 Hours"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
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
                        className="touch-target px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition flex items-center gap-2"
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

                {/* Right: Real-time Live Synchronized Preview */}
                <div className="lg:col-span-5 space-y-3 sticky top-24">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Live Synchronized Preview
                    </span>
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full font-black">
                      Real-Time
                    </span>
                  </div>

                  <div className="bg-[#0C101D] border border-slate-800/90 p-5 rounded-3xl shadow-2xl space-y-4">
                    
                    {/* Mockup Book Box */}
                    <div className="w-full h-64 rounded-2xl bg-gradient-to-tr from-amber-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 text-white text-center shadow mb-2">
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
                    <p className="text-slate-300 text-xs mt-1 line-clamp-3 leading-relaxed font-bold">
                      {description || 'Book summary and synopsis will appear here...'}
                    </p>

                    {/* Bullets Preview */}
                    <div className="pt-3 border-t border-slate-800 space-y-1 text-xs text-slate-300 font-bold">
                      {takeaways.filter(t => t.trim()).slice(0, 3).map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-400">
                          <span>✓</span>
                          <span className="text-slate-300 font-bold">{t}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-bold uppercase">Price</span>
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
              <div className="bg-[#0C101D] border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-black text-white text-base">
                    Published Books in Neon Database ({books.length})
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">
                    Click Edit to modify details or pricing
                  </span>
                </div>

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
                    <tbody className="divide-y divide-slate-800/70 text-slate-300 font-bold">
                      {books.map(b => {
                        const links = Array.isArray(b.buy_links) ? b.buy_links : [];
                        return (
                          <tr key={b.id} className="hover:bg-slate-850/40 transition">
                            <td className="py-3.5 font-black text-white">{b.title}</td>
                            <td className="py-3.5 text-slate-400">{b.genre}</td>
                            <td className="py-3.5 text-amber-400 font-black">{b.price}</td>
                            <td className="py-3.5 text-slate-400">
                              {links.map(l => l.platform).join(', ') || 'None'}
                            </td>
                            <td className="py-3.5">
                              {b.is_featured ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  ⭐ Hero Spotlight
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-800 text-slate-400">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              <button
                                onClick={() => startEditBook(b)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-xs transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBook(b.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-black text-xs transition"
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
          {/* TAB 2: AUTHOR BIO & SOCIAL LINKS */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="bg-[#0C101D] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">Author Profile & Social Links</h3>
                <p className="text-xs text-slate-400 font-bold">
                  Zero hardcoded socials. Update your biography and connection links anytime.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm font-bold">
                <div>
                  <label className="block text-slate-300 mb-1">Author Full Name</label>
                  <input
                    type="text"
                    value={authorProfile.name}
                    onChange={(e) => setAuthorProfile({ ...authorProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Author Headline / Tagline</label>
                  <input
                    type="text"
                    value={authorProfile.tagline}
                    onChange={(e) => setAuthorProfile({ ...authorProfile, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Biography / About Author</label>
                  <textarea
                    rows={4}
                    value={authorProfile.bio}
                    onChange={(e) => setAuthorProfile({ ...authorProfile, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Author Portrait Photo URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://... (leave empty to use initials badge)"
                    value={authorProfile.photo_url || ''}
                    onChange={(e) => setAuthorProfile({ ...authorProfile, photo_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                {/* Dynamic Social Links */}
                <div className="bg-[#080B14] p-4 rounded-2xl border border-slate-800 space-y-3 pt-3">
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
                        placeholder="Platform (Twitter / X, LinkedIn, etc.)"
                        value={s.platform}
                        onChange={(e) => {
                          const copy = [...socialLinks];
                          copy[idx].platform = e.target.value;
                          setSocialLinks(copy);
                        }}
                        className="w-1/3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
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
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
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
            <div className="bg-[#0C101D] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">VIP Readers & Browser Push Notifications</h3>
                <p className="text-xs text-slate-400 font-bold">
                  Real subscriber list stored in your Neon database.
                </p>
              </div>

              <div className="bg-[#080B14] p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">Total VIP Subscribers</span>
                  <span className="text-3xl font-black text-amber-400">{subscriberCount}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ● Web Push Active
                </span>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-400">Test Push Notification on This Device</h4>
                <p className="text-xs text-slate-300 font-bold">
                  Click below to trigger a live browser notification through the registered service worker.
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

              <div className="space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Recent Reader Subscriptions
                </h4>
                {recentSubscribers.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold">No subscribers yet.</p>
                ) : (
                  <div className="divide-y divide-slate-800 bg-[#080B14] rounded-2xl p-4 border border-slate-800">
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

    </div>
  );
}
