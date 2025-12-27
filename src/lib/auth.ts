import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { AuthPayload, User } from '@/types';
import { JWT_SECRET, JWT_EXPIRES_IN, UserRoleValue } from '@/constants';

const secret = new TextEncoder().encode(JWT_SECRET);

export async function createToken(user: User): Promise<string> {
    const payload: AuthPayload = {
        userId: user.id || (user as any)._id?.toString() || '',
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
    };

    if (!payload.userId) {
        throw new Error('User ID is missing');
    }

    const token = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(secret);

    return token;
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as AuthPayload;
    } catch {
        return null;
    }
}

export async function getAuthFromCookies(): Promise<AuthPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function getAuthFromRequest(request: NextRequest): Promise<AuthPayload | null> {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export function requireRole(auth: AuthPayload, allowedRoles: UserRoleValue[]): boolean {
    return allowedRoles.includes(auth.role);
}

// Simple password hashing (for demo purposes - use bcrypt in production)
export function hashPassword(password: string): string {
    // Simple hash for demo - in production use bcrypt
    return btoa(password + '_gearguard_salt');
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
    return hashPassword(password) === hashedPassword;
}
