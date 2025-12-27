import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { createToken, verifyPassword } from '@/lib/auth';
import { loginSchema } from '@/schemas/auth.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid credentials', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Find user
        const user = getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        if (!verifyPassword(password, user.password)) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Account is disabled' },
                { status: 403 }
            );
        }

        // Create JWT token
        const token = await createToken(user);

        // Create response with cookie
        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                teamId: user.teamId,
                avatar: user.avatar,
            },
            message: 'Login successful',
        });

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
