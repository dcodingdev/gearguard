'use client';

import {
    Wrench,
    ClipboardList,
    Users,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from '@/hooks/useDashboard';
import { useRequests } from '@/hooks/useRequests';
import { useAuth } from '@/context/AuthContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
    const { user } = useAuth();
    const { stats, isLoading } = useDashboard();
    const { requests } = useRequests();

    const equipmentChartData = stats
        ? [
            { name: 'Operational', value: stats.operationalEquipment, color: '#22c55e' },
            { name: 'Maintenance', value: stats.underMaintenanceEquipment, color: '#f59e0b' },
            { name: 'Out of Service', value: stats.outOfServiceEquipment, color: '#ef4444' },
        ]
        : [];

    const requestsChartData = stats
        ? [
            { name: 'Open', count: stats.openRequests },
            { name: 'In Progress', count: stats.inProgressRequests },
            { name: 'Completed', count: stats.completedRequests },
        ]
        : [];

    const recentRequests = requests.slice(0, 5);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-400">
                        Here&apos;s what&apos;s happening with your maintenance operations today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Equipment */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Total Equipment
                        </CardTitle>
                        <Wrench className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {stats?.totalEquipment || 0}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                                {stats?.operationalEquipment || 0} operational
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Requests */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Active Requests
                        </CardTitle>
                        <ClipboardList className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {(stats?.openRequests || 0) + (stats?.inProgressRequests || 0)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400">
                                {stats?.openRequests || 0} open, {stats?.inProgressRequests || 0} in progress
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Completed This Month */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Completed
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {stats?.completedRequests || 0}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-400">+12% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Teams */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Teams
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {stats?.totalTeams || 0}
                        </div>
                        <span className="text-xs text-slate-400">
                            {stats?.totalTechnicians || 0} technicians
                        </span>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Equipment Status Chart */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Equipment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={equipmentChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {equipmentChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            {equipmentChartData.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index] }}
                                    />
                                    <span className="text-sm text-slate-400">
                                        {item.name}: {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Requests Chart */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Request Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={requestsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Requests */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentRequests.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">No recent requests</p>
                        ) : (
                            recentRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-2 rounded-lg ${request.priority === 'critical'
                                                    ? 'bg-red-500/20'
                                                    : request.priority === 'high'
                                                        ? 'bg-orange-500/20'
                                                        : 'bg-blue-500/20'
                                                }`}
                                        >
                                            {request.status === 'completed' ? (
                                                <CheckCircle2
                                                    className={`h-5 w-5 ${request.priority === 'critical'
                                                            ? 'text-red-400'
                                                            : request.priority === 'high'
                                                                ? 'text-orange-400'
                                                                : 'text-blue-400'
                                                        }`}
                                                />
                                            ) : request.status === 'in_progress' ? (
                                                <Clock
                                                    className={`h-5 w-5 ${request.priority === 'critical'
                                                            ? 'text-red-400'
                                                            : request.priority === 'high'
                                                                ? 'text-orange-400'
                                                                : 'text-blue-400'
                                                        }`}
                                                />
                                            ) : request.priority === 'critical' ? (
                                                <XCircle className="h-5 w-5 text-red-400" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{request.subject}</p>
                                            <p className="text-sm text-slate-400">
                                                {request.type === 'corrective' ? 'Corrective' : 'Preventive'} •{' '}
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant="outline"
                                            className={
                                                request.status === 'completed'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                    : request.status === 'in_progress'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                            }
                                        >
                                            {request.status.replace('_', ' ')}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className={
                                                request.priority === 'critical'
                                                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                                    : request.priority === 'high'
                                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                                        : request.priority === 'medium'
                                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                            }
                                        >
                                            {request.priority}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
