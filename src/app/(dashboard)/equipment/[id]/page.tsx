'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Wrench,
    Clock,
    Calendar,
    MapPin,
    Tag,
    Building,
    Shield,
    FileText,
    Settings,
    User,
    History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEquipmentById } from '@/hooks/useEquipment';
import { useRequests } from '@/hooks/useRequests';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import { DEPARTMENTS, EQUIPMENT_STATUS, REQUEST_STATUS, REQUEST_PRIORITY } from '@/constants';
import { format } from 'date-fns';

export default function EquipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { equipment, isLoading: equipmentLoading } = useEquipmentById(id);
    const { requests, isLoading: requestsLoading } = useRequests({ equipmentId: id });
    const { teams, isLoading: teamsLoading } = useTeams();
    const { hasRole } = useAuth();

    const maintenanceTeam = useMemo(() => {
        if (!equipment || !teams.length) return null;
        return teams.find(t => t.id === equipment.maintenanceTeamId);
    }, [equipment, teams]);

    const statusBadge = useMemo(() => {
        if (!equipment) return null;
        const status = EQUIPMENT_STATUS.find(s => s.value === equipment.status);
        return (
            <Badge className={
                equipment.status === 'operational' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    equipment.status === 'under_maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        equipment.status === 'out_of_service' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
            }>
                {status?.label || equipment.status}
            </Badge>
        );
    }, [equipment]);

    if (equipmentLoading || requestsLoading || teamsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!equipment) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-white">Equipment not found</h2>
                <Link href="/equipment" className="text-blue-400 hover:underline mt-2 inline-block">
                    Back to Equipment
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/equipment" className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Equipment
                </Link>
                {hasRole(['admin', 'manager']) && (
                    <Link href={`/equipment/${id}/edit`}>
                        <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Asset
                        </Button>
                    </Link>
                )}
            </div>

            {/* Asset Info Card */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-2xl font-bold text-white">{equipment.name}</CardTitle>
                                    {statusBadge}
                                </div>
                                <CardDescription className="text-slate-400 font-mono">
                                    Serial: {equipment.serialNumber}
                                </CardDescription>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800">
                                <Wrench className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Tag className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs">Category</p>
                                        <p className="capitalize">{equipment.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Building className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs">Department</p>
                                        <p>{DEPARTMENTS.find(d => d.value === equipment.department)?.label || equipment.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs">Location</p>
                                        <p>{equipment.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs">Purchase Date</p>
                                        <p>{format(new Date(equipment.purchaseDate), 'PPP')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Shield className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs">Warranty Expiry</p>
                                        <p>{equipment.warrantyExpiry ? format(new Date(equipment.warrantyExpiry), 'PPP') : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <User className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs">Assigned Technician</p>
                                        <p>{equipment.assignedEmployee?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {equipment.notes && (
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-2 text-slate-400">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm font-medium">Notes</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                                    {equipment.notes}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Stats / Team info */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400 font-medium">Maintenance Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Wrench className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{maintenanceTeam?.name || 'No Team Assigned'}</p>
                                    <p className="text-xs text-slate-500">Responsible Group</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400 font-medium">Service History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-bold text-white">{requests.length}</p>
                                    <p className="text-xs text-slate-500">Total Requests</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-500">
                                        {requests.filter(r => r.status === 'repaired').length}
                                    </p>
                                    <p className="text-xs text-slate-500">Resolved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Maintenance History List */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-white">Recent Maintenance Activity</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-800">
                        {requests.length > 0 ? (
                            requests.map((request) => {
                                const status = REQUEST_STATUS.find(s => s.value === request.status);
                                const priority = REQUEST_PRIORITY.find(p => p.value === request.priority);
                                const assignedTeam = teams.find(t => t.id === request.teamId);
                                return (
                                    <Link key={request.id} href={`/requests/${request.id}`}>
                                        <div className="p-6 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-2 w-2 rounded-full ${status?.color || 'bg-slate-500'}`} />
                                                <div>
                                                    <p className="text-white font-medium">{request.subject}</p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {format(new Date(request.createdAt), 'PP')} • Assigned to {assignedTeam?.name || 'Unassigned Team'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={
                                                    request.priority === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        request.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                            'bg-slate-800 text-slate-400'
                                                }>
                                                    {priority?.label}
                                                </Badge>
                                                <Badge className={`${status?.color || 'bg-slate-700'} text-white`}>
                                                    {status?.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center text-slate-500">
                                <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>No maintenance history available for this asset</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
