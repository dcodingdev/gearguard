'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Calendar, LayoutGrid, List, Clock, AlertTriangle, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequests } from '@/hooks/useRequests';
import { useEquipment } from '@/hooks/useEquipment';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import { MaintenanceRequest } from '@/types';
import { REQUEST_STATUS, REQUEST_PRIORITY } from '@/constants';

const KANBAN_COLUMNS = [
    { id: 'new', label: 'New', color: 'bg-blue-500' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
    { id: 'repaired', label: 'Repaired', color: 'bg-green-500' },
    { id: 'scrap', label: 'Scrap', color: 'bg-gray-500' },
];

interface TechnicianInfo {
    id: string;
    name: string;
    avatar?: string;
}

interface RequestCardProps {
    request: MaintenanceRequest;
    isDragging?: boolean;
    technician?: TechnicianInfo;
}

function isOverdue(request: MaintenanceRequest): boolean {
    if (request.status === 'repaired' || request.status === 'scrap' || request.status === 'cancelled') {
        return false;
    }
    const scheduledDate = new Date(request.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduledDate.setHours(0, 0, 0, 0);
    return scheduledDate < today;
}

function RequestCard({ request, isDragging, technician }: RequestCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: request.id,
        data: { type: 'request', request },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityConfig = REQUEST_PRIORITY.find((p) => p.value === request.priority);
    const overdue = isOverdue(request);

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <Card className={`bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors relative overflow-hidden ${overdue ? 'border-l-4 border-l-red-500' : ''}`}>
                {/* Overdue Indicator Strip */}
                {overdue && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                )}

                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-white text-sm line-clamp-2">{request.subject}</h4>
                        <Badge
                            variant="outline"
                            className={`shrink-0 text-[10px] ${request.priority === 'critical'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : request.priority === 'high'
                                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                    : request.priority === 'medium'
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                }`}
                        >
                            {priorityConfig?.label}
                        </Badge>
                    </div>

                    {/* Overdue Warning */}
                    {overdue && (
                        <div className="flex items-center gap-1.5 mb-2 text-red-400 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span className="font-medium">Overdue</span>
                        </div>
                    )}

                    <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                            <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${request.type === 'corrective'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                    }`}
                            >
                                {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className={overdue ? 'text-red-400' : ''}>
                                {new Date(request.scheduledDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Technician Avatar */}
                    {technician && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={technician.avatar} alt={technician.name} />
                                <AvatarFallback className="text-[10px] bg-slate-700 text-slate-300">
                                    {getInitials(technician.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-400 truncate">{technician.name}</span>
                        </div>
                    )}

                    <Link href={`/requests/${request.id}`} className="block mt-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-7 text-xs hover:bg-slate-700"
                        >
                            View Details
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

interface KanbanColumnProps {
    column: { id: string; label: string; color: string };
    requests: MaintenanceRequest[];
    technicianMap: Map<string, TechnicianInfo>;
}

function KanbanColumn({ column, requests, technicianMap }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-white">{column.label}</h3>
                <Badge variant="outline" className="text-slate-400">
                    {requests.length}
                </Badge>
            </div>

            <div
                ref={setNodeRef}
                className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-lg bg-slate-900/50 border transition-colors ${isOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800'}`}
            >
                <SortableContext
                    items={requests.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {requests.map((request) => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            technician={request.assignedTechnicianId ? technicianMap.get(request.assignedTechnicianId) : undefined}
                        />
                    ))}
                </SortableContext>

                {requests.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                        <AlertTriangle className="h-6 w-6 mb-2" />
                        <p className="text-sm">No requests</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function RequestsPage() {
    const searchParams = useSearchParams();
    const equipmentIdFilter = searchParams.get('equipmentId');

    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [activeId, setActiveId] = useState<string | null>(null);
    const { requests, isLoading, updateStatus } = useRequests({ equipmentId: equipmentIdFilter || undefined });
    const { equipment } = useEquipment();
    const { teams } = useTeams();
    const { hasRole } = useAuth();

    // Build technician map from teams
    const technicianMap = useMemo(() => {
        const map = new Map<string, TechnicianInfo>();
        teams.forEach(team => {
            team.members.forEach(member => {
                map.set(member.userId, {
                    id: member.userId,
                    name: member.name,
                    avatar: undefined, // No avatar URLs in current data
                });
            });
        });
        return map;
    }, [teams]);

    // Get equipment name for the filter
    const filteredEquipment = equipmentIdFilter ? equipment.find(e => e.id === equipmentIdFilter) : null;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const activeRequest = activeId ? requests.find((r) => r.id === activeId) : null;

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const overId = over.id as string;
        const activeRequest = requests.find((r) => r.id === active.id);

        if (!activeRequest) return;

        // Check if dropped on a column
        const targetColumn = KANBAN_COLUMNS.find((col) => col.id === overId);
        if (targetColumn && activeRequest.status !== targetColumn.id) {
            await updateStatus(activeRequest.id, targetColumn.id);
        }

        // Check if dropped on another request (get its column)
        const targetRequest = requests.find((r) => r.id === overId);
        if (targetRequest && activeRequest.status !== targetRequest.status) {
            await updateStatus(activeRequest.id, targetRequest.status);
        }
    };

    const getRequestsByStatus = (status: string) => {
        return requests.filter((r) => r.status === status);
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
                <div>
                    <h1 className="text-2xl font-bold text-white">Maintenance Requests</h1>
                    <p className="text-slate-400">Track and manage all maintenance work orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                        <TabsList className="bg-slate-800">
                            <TabsTrigger value="kanban" className="gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                Kanban
                            </TabsTrigger>
                            <TabsTrigger value="list" className="gap-2">
                                <List className="h-4 w-4" />
                                List
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Link href="/requests/calendar">
                        <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Calendar
                        </Button>
                    </Link>
                    {hasRole(['admin', 'manager']) && (
                        <Link href="/requests/new">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                New Request
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Equipment Filter Banner */}
            {filteredEquipment && (
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <span className="text-blue-400 text-sm">
                        Showing requests for: <strong className="text-white">{filteredEquipment.name}</strong>
                    </span>
                    <Link href="/requests">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-400 hover:text-white hover:bg-blue-500/20">
                            <X className="h-4 w-4 mr-1" />
                            Clear Filter
                        </Button>
                    </Link>
                </div>
            )}

            {/* Kanban Board */}
            {viewMode === 'kanban' && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-4 gap-6">
                        {KANBAN_COLUMNS.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                requests={getRequestsByStatus(column.id)}
                                technicianMap={technicianMap}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeRequest ? (
                            <RequestCard
                                request={activeRequest}
                                isDragging
                                technician={activeRequest.assignedTechnicianId ? technicianMap.get(activeRequest.assignedTechnicianId) : undefined}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">All Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {requests.map((request) => {
                                const statusConfig = REQUEST_STATUS.find((s) => s.value === request.status);
                                const priorityConfig = REQUEST_PRIORITY.find((p) => p.value === request.priority);
                                const overdue = isOverdue(request);
                                const technician = request.assignedTechnicianId ? technicianMap.get(request.assignedTechnicianId) : undefined;

                                return (
                                    <div
                                        key={request.id}
                                        className={`flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border ${overdue ? 'border-l-4 border-l-red-500 border-red-500/30' : 'border-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-2 h-12 rounded-full ${statusConfig?.color || 'bg-slate-500'}`}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-white">{request.subject}</h4>
                                                    {overdue && (
                                                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    {request.type === 'corrective' ? 'Corrective' : 'Preventive'} •
                                                    Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* Technician Avatar in List */}
                                            {technician && (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-[10px] bg-slate-700 text-slate-300">
                                                            {technician.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            )}
                                            <Badge
                                                variant="outline"
                                                className={`${statusConfig?.color.replace('bg-', 'bg-').concat('/20')} ${statusConfig?.color
                                                    .replace('bg-', 'text-')
                                                    .replace('-500', '-400')} border-${statusConfig?.color
                                                        .replace('bg-', '')
                                                        .replace('-500', '-500/30')}`}
                                            >
                                                {statusConfig?.label}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    request.priority === 'critical'
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                        : request.priority === 'high'
                                                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                                            : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                                }
                                            >
                                                {priorityConfig?.label}
                                            </Badge>
                                            <Link href={`/requests/${request.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
