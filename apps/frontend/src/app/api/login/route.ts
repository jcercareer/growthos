import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const key = body.key as string | undefined;

  if (!key || key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json(
      { ok: false, error: 'Invalid access key' },
      { status: 401 }
    );
  }

  const cookieStore = cookies();

  // 8-hour admin session
  cookieStore.set('growth_admin', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return NextResponse.json({ ok: true });
}

