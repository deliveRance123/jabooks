import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql`SELECT key, value FROM site_settings`;
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    return NextResponse.json({
      success: true,
      author_profile: settings.author_profile || {
        name: "Joshua Adeoluwa",
        tagline: "Author & Strategic Thinker",
        bio: "Joshua Adeoluwa is an author, strategist, and visionary teacher dedicated to equipping thinkers, leaders, and entrepreneurs to operate with clarity, unyielding discipline, and spiritual grounding.",
        photo_url: ""
      },
      social_links: settings.social_links || [
        { platform: "Twitter / X", url: "https://twitter.com" },
        { platform: "LinkedIn", url: "https://linkedin.com" },
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "Email", url: "mailto:contact@joshuaadeoluwa.com" }
      ]
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = cookies().get('admin_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, value } = await request.json();
    if (!key || !value) {
      return NextResponse.json({ success: false, error: 'Missing key or value' }, { status: 400 });
    }

    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${key}, ${JSON.stringify(value)}::jsonb)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
