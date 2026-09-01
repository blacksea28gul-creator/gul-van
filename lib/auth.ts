import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'ataturk-mulakati-default-secret-key-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const TOKEN_COOKIE_NAME = 'auth_token';

export interface UserSession {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAuthToken(user: { id: string; email: string; name?: string | null; role?: string }): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name || null,
    role: user.role || 'user',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      userId: string;
      email: string;
      name?: string | null;
      role?: string;
      exp?: number;
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    return user;
  } catch (error) {
    console.error('Session user fetch error:', error);
    return null;
  }
}

export const AUTH_COOKIE_CONFIG = {
  name: TOKEN_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};
