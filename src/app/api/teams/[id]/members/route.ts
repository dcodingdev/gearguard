import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getTeamById, updateTeam, generateId } from '@/lib/db';
import { teamMemberSchema } from '@/schemas/team.schema';
import { TeamMember } from '@/types';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!requireRole(auth, ['admin', 'manager'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const team = getTeamById(id);

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        const body = await request.json();
        const result = teamMemberSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const newMember: TeamMember = {
            ...result.data,
            id: generateId(),
        };

        const updatedMembers = [...team.members, newMember];
        const updatedTeam = updateTeam(id, { members: updatedMembers });

        return NextResponse.json(updatedTeam, { status: 201 });
    } catch (error) {
        console.error('Add team member error:', error);
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

        if (!requireRole(auth, ['admin', 'manager'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const team = getTeamById(id);

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const memberId = searchParams.get('memberId');

        if (!memberId) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        const updatedMembers = team.members.filter(m => m.id !== memberId);
        const updatedTeam = updateTeam(id, { members: updatedMembers });

        return NextResponse.json(updatedTeam);
    } catch (error) {
        console.error('Remove team member error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
