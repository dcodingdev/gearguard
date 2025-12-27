import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, requireRole } from '@/lib/auth';
import { getRequestById, updateRequest, deleteRequest, getEquipmentById, updateEquipment, addActivityLog, cancelOtherEquipmentRequests } from '@/lib/db';
import { requestSchema } from '@/schemas/request.schema';

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
        const maintenanceRequest = await getRequestById(id);

        if (!maintenanceRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Technicians can only view requests for their team
        if (auth.role === 'technician' && auth.teamId !== maintenanceRequest.teamId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(maintenanceRequest);
    } catch (error) {
        console.error('Get request error:', error);
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
        const existingRequest = await getRequestById(id);

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Technicians can only update status and duration for their team's requests
        if (auth.role === 'technician') {
            if (auth.teamId !== existingRequest.teamId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            const body = await request.json();
            // Technicians can only update status, assignedTechnicianId, duration, notes
            const allowedFields = ['status', 'assignedTechnicianId', 'duration', 'notes', 'completedDate'];
            const filteredData: Record<string, unknown> = {};

            for (const field of allowedFields) {
                if (body[field] !== undefined) {
                    filteredData[field] = body[field];
                }
            }

            const updated = await updateRequest(id, filteredData);

            // Scrap Logic: If moved to scrap, mark equipment as scrapped
            if (filteredData.status === 'scrap' && existingRequest.status !== 'scrap') {
                const equipment = await getEquipmentById(existingRequest.equipmentId);
                if (equipment && equipment.status !== 'scrapped') {
                    await updateEquipment(existingRequest.equipmentId, {
                        status: 'scrapped',
                        isScraped: true,
                        scrapReason: `Scrapped via maintenance request: ${existingRequest.subject}`,
                    });

                    // Cancel other open requests for this equipment
                    await cancelOtherEquipmentRequests(existingRequest.equipmentId, id);

                    await addActivityLog({
                        type: 'equipment',
                        action: 'status_change',
                        entityId: existingRequest.equipmentId,
                        entityName: equipment.name,
                        userId: auth.userId,
                        userName: auth.name,
                        details: `Equipment marked as scrapped due to maintenance request: ${existingRequest.subject}. Other open requests cancelled.`,
                    });
                }
            }

            return NextResponse.json(updated);
        }

        // Admin/Manager can update everything
        const body = await request.json();
        const result = requestSchema.partial().safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const updated = await updateRequest(id, result.data);

        // Scrap Logic: If moved to scrap, mark equipment as scrapped
        if (result.data.status === 'scrap' && existingRequest.status !== 'scrap') {
            const equipment = await getEquipmentById(existingRequest.equipmentId);
            if (equipment && equipment.status !== 'scrapped') {
                await updateEquipment(existingRequest.equipmentId, {
                    status: 'scrapped',
                    isScraped: true,
                    scrapReason: `Scrapped via maintenance request: ${existingRequest.subject}`,
                });

                // Cancel other open requests for this equipment
                await cancelOtherEquipmentRequests(existingRequest.equipmentId, id);

                await addActivityLog({
                    type: 'equipment',
                    action: 'status_change',
                    entityId: existingRequest.equipmentId,
                    entityName: equipment.name,
                    userId: auth.userId,
                    userName: auth.name,
                    details: `Equipment marked as scrapped due to maintenance request: ${existingRequest.subject}. Other open requests cancelled.`,
                });
            }
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update request error:', error);
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
        const deleted = await deleteRequest(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Request deleted' });
    } catch (error) {
        console.error('Delete request error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
