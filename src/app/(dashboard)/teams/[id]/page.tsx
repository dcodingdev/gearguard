'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Users,
    Trash2,
    Wrench,
    Zap,
    Monitor,
    Building,
    CheckCircle2,
    Clock,
    User,
    Mail,
    Shield,
    Calendar,
    Settings,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeams } from '@/hooks/useTeams';
import { useRequests } from '@/hooks/useRequests';
import { useEquipment } from '@/hooks/useEquipment';
import { useAuth } from '@/context/AuthContext';
import { REQUEST_STATUS, REQUEST_PRIORITY } from '@/constants';
import { toast } from 'sonner';

const getTeamIcon = (specialization: string) => {
    const lower = specialization.toLowerCase();
    if (lower.includes('mechanic') || lower.includes('machine')) return <Wrench className="h-6 w-6" />;
    if (lower.includes('electric')) return <Zap className="h-6 w-6" />;
    if (lower.includes('it') || lower.includes('computer')) return <Monitor className="h-6 w-6" />;
    if (lower.includes('facilit') || lower.includes('building')) return <Building className="h-6 w-6" />;
    return <Users className="h-6 w-6" />;
};

const getTeamColor = (specialization: string) => {
    const lower = specialization.toLowerCase();
    if (lower.includes('mechanic')) return 'bg-blue-600';
    if (lower.includes('electric')) return 'bg-amber-600';
    if (lower.includes('it')) return 'bg-purple-600';
    if (lower.includes('facilit')) return 'bg-green-600';
    return 'bg-slate-600';
};

export default function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { teams, isLoading: teamsLoading } = useTeams();
    const { requests, isLoading: requestsLoading } = useRequests({ teamId: id });
    const { equipment, isLoading: equipmentLoading } = useEquipment();
    const { hasRole } = useAuth();
    const { deleteTeam } = useTeams();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const team = teams.find(t => t.id === id);
    const teamEquipment = equipment.filter(e => e.maintenanceTeamId === id);

    if (teamsLoading || requestsLoading || equipmentLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="p-4 rounded-full bg-slate-800 text-slate-400">
                    <Users className="h-12 w-12" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">Team Not Found</h3>
                    <p className="text-slate-400">The team you are looking for does not exist or has been removed.</p>
                </div>
                <Link href="/teams">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Teams
                    </Button>
                </Link>
            </div>
        );
    }

    const completedRequests = requests.filter(r => r.status === 'repaired').length;
    const progressPerc = requests.length > 0 ? (completedRequests / requests.length) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Breadcrumbs & Actions */}
            <div className="flex items-center justify-between">
                <Link href="/teams" className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Teams
                </Link>
                {hasRole(['admin', 'manager']) && (
                    <div className="flex items-center gap-2">
                        <Link href={`/teams/${id}/edit`}>
                            <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Team
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="bg-red-900/20 border-red-900/30 text-red-400 hover:bg-red-900/40"
                            onClick={async () => {
                                if (confirm('Are you sure you want to delete this team? All members and assignments will be unlinked.')) {
                                    setIsDeleting(true);
                                    try {
                                        await deleteTeam(id);
                                        toast.success('Team deleted successfully');
                                        router.push('/teams');
                                    } catch (error) {
                                        toast.error('Failed to delete team');
                                        setIsDeleting(false);
                                    }
                                }
                            }}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeleting ? 'Deleting...' : 'Delete Team'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Team Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800">
                <div className={`absolute top-0 left-0 w-2 h-full ${getTeamColor(team.specialization)}`} />
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className={`p-4 rounded-2xl ${getTeamColor(team.specialization)} shadow-xl`}>
                            {getTeamIcon(team.specialization)}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                                    {team.specialization}
                                </Badge>
                            </div>
                            <p className="text-lg text-slate-400 max-w-2xl">{team.description}</p>
                        </div>
                        <div className="flex gap-4 md:border-l md:border-slate-800 md:pl-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{team.members.length}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Members</p>
                            </div>
                            <div className="text-center border-l border-slate-800 pl-4">
                                <p className="text-2xl font-bold text-white">{requests.length}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Requests</p>
                            </div>
                            <div className="text-center border-l border-slate-800 pl-4">
                                <p className="text-2xl font-bold text-green-500">
                                    {team.members.filter(m => m.isAvailable).length}
                                </p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="members" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 p-1">
                    <TabsTrigger value="members" className="gap-2">
                        <Users className="h-4 w-4" />
                        Team Members
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Work Requests
                    </TabsTrigger>
                    <TabsTrigger value="equipment" className="gap-2">
                        <Wrench className="h-4 w-4" />
                        Managed Equipment
                    </TabsTrigger>
                </TabsList>

                {/* Team Members Tab */}
                <TabsContent value="members" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {team.members.map((member) => (
                            <Card key={member.userId} className="bg-slate-900 border-slate-800 overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-blue-500 transition-colors">
                                            <AvatarFallback className="bg-slate-800 text-slate-300 text-lg">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-white truncate">{member.name}</h3>
                                                {member.role === 'lead' && (
                                                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">Lead</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${member.isAvailable ? 'bg-green-500' : 'bg-slate-600'}`} />
                                            <span className="text-xs text-slate-400">
                                                {member.isAvailable ? 'Available Now' : 'Busy / Offline'}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-800">
                                            Technician
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {team.members.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                                <Users className="h-8 w-8 mb-2 opacity-20" />
                                <p>No members in this team yet</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Work Requests Tab */}
                <TabsContent value="requests" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Active Assignments</CardTitle>
                                <CardDescription>Maintenance requests assigned to this team</CardDescription>
                            </div>
                            <Link href={`/requests?teamId=${team.id}`}>
                                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                                    View All <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {requests.slice(0, 5).map((request) => {
                                    const statusConfig = REQUEST_STATUS.find(s => s.value === request.status);
                                    const priorityConfig = REQUEST_PRIORITY.find(p => p.value === request.priority);
                                    return (
                                        <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-1 h-10 rounded-full ${statusConfig?.color || 'bg-slate-500'}`} />
                                                <div>
                                                    <h4 className="font-medium text-white text-sm">{request.subject}</h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                        <span className="capitalize">{request.type}</span>
                                                        <span>•</span>
                                                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className={`${priorityConfig?.value === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-400'}`}
                                                >
                                                    {priorityConfig?.label}
                                                </Badge>
                                                <Badge className={`${statusConfig?.color || 'bg-slate-700'} text-white`}>
                                                    {statusConfig?.label}
                                                </Badge>
                                                <Link href={`/requests/${request.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ArrowLeft className="h-4 w-4 rotate-180" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                                {requests.length === 0 && (
                                    <div className="py-8 text-center text-slate-500">
                                        No active requests for this team
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Equipment Tab */}
                <TabsContent value="equipment" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {teamEquipment.map((item) => (
                            <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="p-2 rounded-lg bg-slate-800">
                                            <Wrench className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <Badge variant={item.status === 'operational' ? 'secondary' : 'destructive'} className={item.status === 'operational' ? 'bg-green-500/10 text-green-500' : ''}>
                                            {item.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-white text-lg mt-4">{item.name}</CardTitle>
                                    <CardDescription>{item.category.toUpperCase()} • {item.location}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                        <span className="text-xs text-slate-500">S/N: {item.serialNumber}</span>
                                        <Link href={`/equipment?id=${item.id}`}>
                                            <Button variant="link" size="sm" className="text-blue-400 h-auto p-0">View History</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {teamEquipment.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                                <Wrench className="h-8 w-8 mb-2 opacity-20" />
                                <p>No equipment assigned to this team</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
