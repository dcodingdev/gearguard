import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getUserById, updateUser, deleteUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Users can view themselves, admins/managers can view any user
        if (auth.userId !== id && !requireRole(auth, ['admin', 'manager'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await getUserById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { password, ...userWithoutPassword } = user as any;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Users can update some fields of themselves, admins can update everything
        if (auth.userId !== id && !requireRole(auth, ['admin'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updateData: any = { ...body };
        if (updateData.password && updateData.password.trim() !== '') {
            updateData.password = hashPassword(updateData.password);
        } else {
            delete updateData.password;
        }

        // Restrict non-admins from changing roles or teams
        if (auth.role !== 'admin') {
            delete updateData.role;
            delete updateData.teamId;
            delete updateData.isActive;
        }

        const updatedUser = await updateUser(id, updateData);
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { password, ...userWithoutPassword } = updatedUser as any;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!requireRole(auth, ['admin'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;

        // Prevent deleting self
        if (auth.userId === id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        const deleted = await deleteUser(id);
        if (!deleted) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
