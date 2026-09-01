import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_CONFIG } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_CONFIG.name);

    return NextResponse.json({
      message: 'Başarıyla çıkış yapıldı.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Çıkış yapılırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
