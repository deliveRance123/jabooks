import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'joshua';

    if (password === correctPassword) {
      // Set secure session cookie
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Welcome, Joshua!' });
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const session = cookies().get('admin_session');
  return NextResponse.json({ authenticated: session?.value === 'authenticated' });
}

export async function DELETE() {
  cookies().delete('admin_session');
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
