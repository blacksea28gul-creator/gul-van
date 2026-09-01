import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session me error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı bilgisi alınamadı.', user: null },
      { status: 500 }
    );
  }
}
