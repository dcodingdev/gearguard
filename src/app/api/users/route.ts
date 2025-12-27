import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getUsers, createUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!requireRole(auth, ['admin', 'manager'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await getUsers();
        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password, ...u } = user as any;
            return u;
        });

        return NextResponse.json(usersWithoutPasswords);
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!requireRole(auth, ['admin'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { email, password, name, role, teamId } = body;

        if (!email || !password || !name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await createUser({
            email,
            password: hashPassword(password),
            name,
            role,
            teamId,
            isActive: true,
        });

        const { password: _, ...userWithoutPassword } = user as any;
        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
