import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const session = cookies().get('admin_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const data = await request.json();
    const {
      title,
      tagline,
      genre,
      price,
      cover_url,
      description,
      takeaways,
      audience,
      sample_excerpt,
      pages,
      reading_time,
      buy_links,
      is_featured,
    } = data;

    if (is_featured) {
      await sql`UPDATE books SET is_featured = false WHERE id != ${id}`;
    }

    const updated = await sql`
      UPDATE books SET
        title = COALESCE(${title}, title),
        tagline = COALESCE(${tagline}, tagline),
        genre = COALESCE(${genre}, genre),
        price = COALESCE(${price}, price),
        cover_url = COALESCE(${cover_url}, cover_url),
        description = COALESCE(${description}, description),
        takeaways = COALESCE(${JSON.stringify(takeaways)}::jsonb, takeaways),
        audience = COALESCE(${JSON.stringify(audience)}::jsonb, audience),
        sample_excerpt = COALESCE(${sample_excerpt}, sample_excerpt),
        pages = COALESCE(${pages}, pages),
        reading_time = COALESCE(${reading_time}, reading_time),
        buy_links = COALESCE(${JSON.stringify(buy_links)}::jsonb, buy_links),
        is_featured = COALESCE(${is_featured}, is_featured)
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, book: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = cookies().get('admin_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    await sql`DELETE FROM books WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
