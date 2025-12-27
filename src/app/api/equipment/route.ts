import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getEquipment, createEquipment } from '@/lib/db';
import { equipmentSchema } from '@/schemas/equipment.schema';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department') || undefined;
        const status = searchParams.get('status') || undefined;
        const search = searchParams.get('search') || undefined;

        const equipment = getEquipment({ department, status, search });
        return NextResponse.json(equipment);
    } catch (error) {
        console.error('Get equipment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only admin and manager can create equipment
        if (!requireRole(auth, ['admin', 'manager'])) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const result = equipmentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const equipment = createEquipment(result.data);
        return NextResponse.json(equipment, { status: 201 });
    } catch (error) {
        console.error('Create equipment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
