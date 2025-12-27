'use client';

import {
    BarChart3,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboard } from '@/hooks/useDashboard';
import { useRequests } from '@/hooks/useRequests';
import { useEquipment } from '@/hooks/useEquipment';
import { DEPARTMENTS, REQUEST_STATUS, EQUIPMENT_STATUS } from '@/constants';
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
    LineChart,
    Line,
    Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsPage() {
    const { stats, isLoading } = useDashboard();
    const { requests } = useRequests();
    const { equipment } = useEquipment();

    // Equipment by Department
    const equipmentByDept = DEPARTMENTS.map((dept) => ({
        name: dept.label,
        count: equipment.filter((e) => e.department === dept.value).length,
    })).filter((d) => d.count > 0);

    // Equipment by Status
    const equipmentByStatus = EQUIPMENT_STATUS.map((status) => ({
        name: status.label,
        value: equipment.filter((e) => e.status === status.value).length,
    }));

    // Requests by Type
    const requestsByType = [
        { name: 'Corrective', value: requests.filter((r) => r.type === 'corrective').length },
        { name: 'Preventive', value: requests.filter((r) => r.type === 'preventive').length },
    ];

    // Requests by Status
    const requestsByStatus = REQUEST_STATUS.map((status) => ({
        name: status.label,
        value: requests.filter((r) => r.status === status.value).length,
    }));

    // Mock trend data (in real app, this would come from API)
    const trendData = [
        { month: 'Jan', requests: 12, completed: 10 },
        { month: 'Feb', requests: 15, completed: 14 },
        { month: 'Mar', requests: 8, completed: 8 },
        { month: 'Apr', requests: 20, completed: 18 },
        { month: 'May', requests: 16, completed: 15 },
        { month: 'Jun', requests: 22, completed: 20 },
    ];

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
            <div>
                <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                <p className="text-slate-400">
                    Insights and statistics about your maintenance operations
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/20">
                                <BarChart3 className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Requests</p>
                                <p className="text-2xl font-bold text-white">{stats?.totalRequests || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/20">
                                <CheckCircle2 className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Completed</p>
                                <p className="text-2xl font-bold text-white">{stats?.completedRequests || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-amber-500/20">
                                <Clock className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">In Progress</p>
                                <p className="text-2xl font-bold text-white">{stats?.inProgressRequests || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-red-500/20">
                                <AlertTriangle className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Open</p>
                                <p className="text-2xl font-bold text-white">{stats?.openRequests || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-slate-800">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Equipment Status Pie */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Equipment by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={equipmentByStatus}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {equipmentByStatus.map((entry, index) => (
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
                            </CardContent>
                        </Card>

                        {/* Requests by Type */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Requests by Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={requestsByType}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {requestsByType.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={index === 0 ? '#ef4444' : '#3b82f6'}
                                                    />
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
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="equipment" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Equipment by Department</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={equipmentByDept} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis type="number" stroke="#64748b" />
                                        <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Requests by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={requestsByStatus}>
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
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Request Trends (Last 6 Months)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="month" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="requests"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="completed"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            dot={{ fill: '#22c55e' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
