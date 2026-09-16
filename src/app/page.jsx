import { sql } from '@/lib/db';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let books = [];
  let settings = {
    author_profile: {
      name: "Joshua Adeoluwa",
      tagline: "Author & Strategic Thinker",
      bio: "Joshua Adeoluwa is an author, strategist, and visionary teacher dedicated to equipping thinkers, leaders, and entrepreneurs to operate with clarity, unyielding discipline, and spiritual grounding."
    },
    social_links: [
      { platform: "Twitter / X", url: "https://twitter.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "Instagram", url: "https://instagram.com" },
      { platform: "Email", url: "mailto:contact@joshuaadeoluwa.com" }
    ]
  };

  try {
    const booksQuery = await sql`
      SELECT * FROM books 
      ORDER BY is_featured DESC, display_order ASC, created_at DESC
    `;
    books = booksQuery || [];

    const settingsQuery = await sql`SELECT key, value FROM site_settings`;
    if (settingsQuery && settingsQuery.length > 0) {
      settingsQuery.forEach(r => {
        settings[r.key] = r.value;
      });
    }
  } catch (error) {
    console.error('Database query error on HomePage:', error);
  }

  return <HomeClient initialBooks={books} initialSettings={settings} />;
}
