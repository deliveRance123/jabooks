import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const books = await sql`
      SELECT * FROM books 
      ORDER BY is_featured DESC, display_order ASC, created_at DESC
    `;
    return NextResponse.json({ success: true, books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  // Check admin session
  const session = cookies().get('admin_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      title,
      tagline = '',
      genre,
      price,
      cover_url = '',
      description,
      takeaways = [],
      audience = [],
      sample_excerpt = '',
      pages = '250 Pages',
      reading_time = '~4.5 Hours',
      buy_links = [],
      is_featured = false,
    } = data;

    if (!title || !genre || !price || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // If setting as featured, unfeature previous featured books
    if (is_featured) {
      await sql`UPDATE books SET is_featured = false WHERE is_featured = true`;
    }

    const inserted = await sql`
      INSERT INTO books (
        title, tagline, genre, price, cover_url, description,
        takeaways, audience, sample_excerpt, pages, reading_time,
        buy_links, is_featured
      ) VALUES (
        ${title},
        ${tagline},
        ${genre},
        ${price},
        ${cover_url},
        ${description},
        ${JSON.stringify(takeaways)}::jsonb,
        ${JSON.stringify(audience)}::jsonb,
        ${sample_excerpt},
        ${pages},
        ${reading_time},
        ${JSON.stringify(buy_links)}::jsonb,
        ${Boolean(is_featured)}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, book: inserted[0] });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
