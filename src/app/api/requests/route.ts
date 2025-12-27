import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getRequests, createRequest } from '@/lib/db';
import { requestSchema } from '@/schemas/request.schema';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const type = searchParams.get('type') || undefined;
        const teamId = searchParams.get('teamId') || undefined;
        const equipmentId = searchParams.get('equipmentId') || undefined;

        let requests = getRequests({ status, type, teamId, equipmentId });

        // Technicians can only see requests for their team
        if (auth.role === 'technician' && auth.teamId) {
            requests = requests.filter(r => r.teamId === auth.teamId);
        }

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Get requests error:', error);
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
        const result = requestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const maintenanceRequest = createRequest({
            ...result.data,
            createdBy: auth.userId,
        });

        return NextResponse.json(maintenanceRequest, { status: 201 });
    } catch (error) {
        console.error('Create request error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
