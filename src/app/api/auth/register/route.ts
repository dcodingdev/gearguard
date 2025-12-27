import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth'; // Ensure this uses a robust hash in production
import { registerSchema } from '@/schemas/auth.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create user (default role: technician)
        const newUser = await createUser({
            name,
            email,
            password: hashPassword(password),
            role: 'technician',
            isActive: true,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        });

        // Return success (excluding password)
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { message: 'User created successfully', user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
