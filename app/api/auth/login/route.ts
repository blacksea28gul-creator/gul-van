import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createAuthToken, AUTH_COOKIE_CONFIG } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gereklidir.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'E-posta adresi veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'E-posta adresi veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Create session token and set cookie
    const token = await createAuthToken(user);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_CONFIG.name, token, AUTH_COOKIE_CONFIG.options);

    return NextResponse.json({
      message: 'Giriş başarılı.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
