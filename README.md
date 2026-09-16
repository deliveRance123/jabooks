# Joshua Adeoluwa — Author Showcase & Book Campaign Website

A full-stack, mobile-first book showcase and campaign platform built with **Next.js**, **Tailwind CSS**, and **Neon PostgreSQL**, optimized for **Vercel** deployment.

---

## 🌟 Features

1. **Zero Hardcoded Data**:
   - Every book, description, price, chapter excerpt, and key takeaway is loaded dynamically from your **Neon PostgreSQL** database.
   - **Dynamic Selling Platforms**: Add Amazon, Selar, Paystack, Gumroad, Barnes & Noble, or any custom platform link directly from the Admin Studio without writing code.
   - **Dynamic Social Media Links**: Add, edit, or remove your Twitter/X, LinkedIn, Instagram, and Email links from the Admin panel.

2. **Mobile-First & Ultra-Readable UI**:
   - Custom 3D book covers with realistic spine depth and ambient lighting.
   - Smooth **Mobile Hamburger Menu Drawer** on smartphones.
   - High-contrast, bold typography designed for maximum readability across monitors, tablets, and phones.
   - **Sticky Mobile Purchase Bar** for high conversion rates.

3. **In-Depth Book Presentation**:
   - Live Search & Category filters.
   - In-depth modal with:
     - The Big Promise & Full Synopsis
     - 🎯 What You Will Master (4 Key Takeaways)
     - 👥 Who This Book Was Written For (Audience Tags)
     - 📜 Sample Chapter Excerpt
     - 📊 Specifications (Pages, Reading Time, Formats)
     - 🛒 Multi-Merchant Direct Checkout Selector

4. **Real VIP Reader Circle with Browser Push Notifications**:
   - Real subscriber storage in the Neon PostgreSQL database (`subscribers` table).
   - Real **Browser Web Push Notifications** via Service Worker (`/sw.js`).
   - Instant test notification sender directly inside the Admin panel.

5. **Secure Author Studio (`/admin`)**:
   - Protected by password: **`joshua`**.
   - Create, edit, and delete books.
   - Toggle **⭐ Hero Spotlight** to pin any book to the top banner.
   - Real-time live synchronization card preview while typing.

---

## 🚀 How to Run Locally

```bash
# 1. Start the development server
npm run dev

# 2. Open in your browser
http://localhost:3000

# 3. Access Author Admin Dashboard
http://localhost:3000/admin
# Password: joshua
```

---

## ☁️ How to Deploy to Vercel (in 2 Minutes)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Joshua Adeoluwa Book Website"
   # Create a repository on github.com and push
   git remote add origin https://github.com/YOUR_USERNAME/joshua-books.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and import your repository.
   - Under **Environment Variables**, add:
     - `DATABASE_URL`: `postgresql://neondb_owner:npg_I0muc2VQYdUW@ep-mute-recipe-a5vdctrn-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`
     - `ADMIN_PASSWORD`: `joshua`
   - Click **Deploy**!

Vercel will build your website automatically with free SSL, global CDN, and automatic updates every time you push code.
