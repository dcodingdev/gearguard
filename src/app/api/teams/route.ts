import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getTeams, createTeam } from '@/lib/db';
import { teamSchema } from '@/schemas/team.schema';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const teams = getTeams();
        return NextResponse.json(teams);
    } catch (error) {
        console.error('Get teams error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!requireRole(auth, ['admin', 'manager'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const result = teamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const team = createTeam(result.data);
        return NextResponse.json(team, { status: 201 });
    } catch (error) {
        console.error('Create team error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
