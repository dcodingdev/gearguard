'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ArrowLeft, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRequests } from '@/hooks/useRequests';
import { useAuth } from '@/context/AuthContext';
import { MaintenanceRequest } from '@/types';

export default function CalendarPage() {
    const router = useRouter();
    const { requests, isLoading } = useRequests();
    const { hasRole } = useAuth();
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const [showPreventiveOnly, setShowPreventiveOnly] = useState(false);

    // Filter requests based on toggle
    const filteredRequests = showPreventiveOnly
        ? requests.filter(r => r.type === 'preventive')
        : requests;

    const events = filteredRequests.map((request) => ({
        id: request.id,
        title: request.subject,
        date: request.scheduledDate,
        backgroundColor:
            request.type === 'preventive'
                ? request.status === 'repaired'
                    ? '#22c55e'
                    : '#3b82f6'
                : request.priority === 'critical'
                    ? '#ef4444'
                    : request.priority === 'high'
                        ? '#f59e0b'
                        : '#6366f1',
        borderColor: 'transparent',
        extendedProps: { request },
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEventClick = (info: any) => {
        setSelectedRequest(info.event.extendedProps.request as MaintenanceRequest);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDateClick = (info: any) => {
        if (hasRole(['admin', 'manager'])) {
            // Pre-select preventive type when creating from calendar
            router.push(`/requests/new?date=${info.dateStr}&type=preventive`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/requests">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Maintenance Calendar</h1>
                        <p className="text-slate-400">Schedule and view maintenance activities</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Preventive Only Toggle */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <Label htmlFor="preventive-filter" className="text-sm text-slate-300 cursor-pointer">
                            Preventive Only
                        </Label>
                        <Switch
                            id="preventive-filter"
                            checked={showPreventiveOnly}
                            onCheckedChange={setShowPreventiveOnly}
                        />
                    </div>
                    {hasRole(['admin', 'manager']) && (
                        <Link href="/requests/new?type=preventive">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                New Preventive Request
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-400">Preventive</span>
                </div>
                {!showPreventiveOnly && (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500" />
                            <span className="text-sm text-slate-400">Corrective (Low/Medium)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-sm text-slate-400">Corrective (High)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm text-slate-400">Corrective (Critical)</span>
                        </div>
                    </>
                )}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-slate-400">Completed</span>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">
                                {requests.filter(r => r.type === 'preventive').length}
                            </p>
                            <p className="text-sm text-slate-400">Preventive Requests</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-400">
                                {requests.filter(r => r.type === 'preventive' && r.status === 'new').length}
                            </p>
                            <p className="text-sm text-slate-400">Scheduled (New)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">
                                {requests.filter(r => r.type === 'preventive' && r.status === 'repaired').length}
                            </p>
                            <p className="text-sm text-slate-400">Completed</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar */}
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                    <div className="fc-dark-theme">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={handleDateClick}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek',
                            }}
                            height="auto"
                            eventDisplay="block"
                            dayMaxEvents={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Request Detail Dialog */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{selectedRequest?.subject}</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Badge
                                    className={
                                        selectedRequest.type === 'preventive'
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-red-500/20 text-red-400'
                                    }
                                >
                                    {selectedRequest.type === 'preventive' ? 'Preventive' : 'Corrective'}
                                </Badge>
                                <Badge
                                    className={
                                        selectedRequest.status === 'repaired'
                                            ? 'bg-green-500/20 text-green-400'
                                            : selectedRequest.status === 'in_progress'
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                    }
                                >
                                    {selectedRequest.status.replace('_', ' ')}
                                </Badge>
                                <Badge
                                    className={
                                        selectedRequest.priority === 'critical'
                                            ? 'bg-red-500/20 text-red-400'
                                            : selectedRequest.priority === 'high'
                                                ? 'bg-orange-500/20 text-orange-400'
                                                : 'bg-slate-500/20 text-slate-400'
                                    }
                                >
                                    {selectedRequest.priority}
                                </Badge>
                            </div>

                            <p className="text-slate-400">{selectedRequest.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Scheduled Date</span>
                                    <span className="text-slate-300">
                                        {new Date(selectedRequest.scheduledDate).toLocaleDateString()}
                                    </span>
                                </div>
                                {selectedRequest.duration && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Duration</span>
                                        <span className="text-slate-300">{selectedRequest.duration} minutes</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Link href={`/requests/${selectedRequest.id}`} className="flex-1">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        View Full Details
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Calendar Styles */}
            <style jsx global>{`
        .fc-dark-theme .fc {
          --fc-border-color: #334155;
          --fc-button-bg-color: #1e293b;
          --fc-button-border-color: #334155;
          --fc-button-text-color: #f8fafc;
          --fc-button-hover-bg-color: #334155;
          --fc-button-hover-border-color: #475569;
          --fc-button-active-bg-color: #3b82f6;
          --fc-button-active-border-color: #3b82f6;
          --fc-event-text-color: #fff;
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #0f172a;
          --fc-list-event-hover-bg-color: #1e293b;
        }

        .fc-dark-theme .fc-daygrid-day-number,
        .fc-dark-theme .fc-col-header-cell-cushion {
          color: #f8fafc;
        }

        .fc-dark-theme .fc-daygrid-day.fc-day-other .fc-daygrid-day-number {
          color: #64748b;
        }

        .fc-dark-theme .fc-toolbar-title {
          color: #f8fafc;
          font-size: 1.25rem;
        }

        .fc-dark-theme .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .fc-dark-theme .fc-daygrid-more-link {
          color: #3b82f6;
        }
      `}</style>
        </div>
    );
}
