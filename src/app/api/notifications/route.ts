import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { getActivityLog } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return the last 20 activities as "notifications"
        const activities = await getActivityLog(20);
        return NextResponse.json(activities);
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
