import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: 'Onjuist wachtwoord. Probeer het opnieuw.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('app_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
    path: '/',
  });
  return res;
}

export async function POST_logout(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('app_auth');
  return res;
}
