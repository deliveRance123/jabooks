import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await sql`SELECT COUNT(*) FROM subscribers`;
    const latest = await sql`SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC LIMIT 10`;
    return NextResponse.json({
      success: true,
      total_subscribers: parseInt(count[0].count, 10),
      subscribers: latest
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, push_subscription } = await request.json();

    if (!email && !push_subscription) {
      return NextResponse.json({ success: false, error: 'Email or Push subscription required' }, { status: 400 });
    }

    // Save or update subscriber
    if (email) {
      await sql`
        INSERT INTO subscribers (email, push_subscription)
        VALUES (${email.trim().toLowerCase()}, ${push_subscription ? JSON.stringify(push_subscription) : null}::jsonb)
        ON CONFLICT (email) 
        DO UPDATE SET push_subscription = COALESCE(EXCLUDED.push_subscription, subscribers.push_subscription)
      `;
    } else if (push_subscription) {
      await sql`
        INSERT INTO subscribers (push_subscription)
        VALUES (${JSON.stringify(push_subscription)}::jsonb)
      `;
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Joshua Adeoluwa VIP Reader Circle!'
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
