'use client';

import { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Wrench,
    Truck,
    Monitor,
    Package,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEquipment } from '@/hooks/useEquipment';
import { useEquipmentRequestCounts } from '@/hooks/useEquipmentRequests';
import { useAuth } from '@/context/AuthContext';
import { DEPARTMENTS, EQUIPMENT_STATUS } from '@/constants';
import { Equipment } from '@/types';
import { MaintenanceButton } from '@/components/ui/MaintenanceButton';

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'machine':
            return <Wrench className="h-4 w-4" />;
        case 'vehicle':
            return <Truck className="h-4 w-4" />;
        case 'computer':
            return <Monitor className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'operational':
            return (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                    Operational
                </Badge>
            );
        case 'under_maintenance':
            return (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
                    Under Maintenance
                </Badge>
            );
        case 'out_of_service':
            return (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                    Out of Service
                </Badge>
            );
        case 'scrapped':
            return (
                <Badge className="bg-gray-600/20 text-gray-400 border-gray-600/30 hover:bg-gray-600/30">
                    Scrapped
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function EquipmentPage() {
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const { hasRole } = useAuth();

    const { equipment, isLoading, deleteEquipment } = useEquipment({
        search,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    // Get request counts for all equipment
    const equipmentIds = useMemo(() => equipment.map(e => e.id), [equipment]);
    const { counts: requestCounts } = useEquipmentRequestCounts(equipmentIds);

    const groupedByDepartment = equipment.reduce((acc, item) => {
        const dept = item.department;
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(item);
        return acc;
    }, {} as Record<string, Equipment[]>);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this equipment?')) {
            await deleteEquipment(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Equipment</h1>
                    <p className="text-slate-400">Manage and track all company assets</p>
                </div>
                {hasRole(['admin', 'manager']) && (
                    <Link href="/equipment/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Equipment
                        </Button>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                        placeholder="Search equipment..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white"
                    />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">All Departments</SelectItem>
                        {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">All Status</SelectItem>
                        {EQUIPMENT_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            <Tabs defaultValue="table" className="w-full">
                <TabsList className="bg-slate-800 border-slate-700">
                    <TabsTrigger value="table" onClick={() => setViewMode('table')}>
                        Table View
                    </TabsTrigger>
                    <TabsTrigger value="grouped" onClick={() => setViewMode('grid')}>
                        Group by Department
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="text-slate-400">Name</TableHead>
                                            <TableHead className="text-slate-400">Serial #</TableHead>
                                            <TableHead className="text-slate-400">Category</TableHead>
                                            <TableHead className="text-slate-400">Department</TableHead>
                                            <TableHead className="text-slate-400">Location</TableHead>
                                            <TableHead className="text-slate-400">Status</TableHead>
                                            <TableHead className="text-slate-400">Maintenance</TableHead>
                                            <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {equipment.map((item) => (
                                            <TableRow key={item.id} className="border-slate-800">
                                                <TableCell className="font-medium text-white">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-lg bg-slate-800">
                                                            {getCategoryIcon(item.category)}
                                                        </div>
                                                        {item.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-400">{item.serialNumber}</TableCell>
                                                <TableCell className="text-slate-400 capitalize">{item.category}</TableCell>
                                                <TableCell className="text-slate-400">
                                                    {DEPARTMENTS.find((d) => d.value === item.department)?.label || item.department}
                                                </TableCell>
                                                <TableCell className="text-slate-400">{item.location}</TableCell>
                                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                <TableCell>
                                                    <MaintenanceButton
                                                        equipmentId={item.id}
                                                        openRequestCount={requestCounts[item.id] || 0}
                                                        variant="compact"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                                            <Link href={`/equipment/${item.id}`}>
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            {hasRole(['admin', 'manager']) && (
                                                                <>
                                                                    <Link href={`/equipment/${item.id}/edit`}>
                                                                        <DropdownMenuItem className="cursor-pointer">
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                    </Link>
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer text-red-400"
                                                                        onClick={() => handleDelete(item.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="grouped" className="mt-4">
                    <div className="space-y-6">
                        {Object.entries(groupedByDepartment).map(([dept, items]) => (
                            <div key={dept}>
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    {DEPARTMENTS.find((d) => d.value === dept)?.label || dept}
                                    <Badge variant="outline" className="text-slate-400">
                                        {items.length}
                                    </Badge>
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map((item) => (
                                        <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-slate-800">
                                                            {getCategoryIcon(item.category)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">{item.name}</h4>
                                                            <p className="text-sm text-slate-400">{item.serialNumber}</p>
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(item.status)}
                                                </div>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Location</span>
                                                        <span className="text-slate-300">{item.location}</span>
                                                    </div>
                                                    {item.assignedEmployee && (
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Assigned To</span>
                                                            <span className="text-slate-300">{item.assignedEmployee.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <MaintenanceButton
                                                        equipmentId={item.id}
                                                        openRequestCount={requestCounts[item.id] || 0}
                                                        variant="compact"
                                                    />
                                                    <Link href={`/equipment/${item.id}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    {hasRole(['admin', 'manager']) && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                                                <Link href={`/equipment/${item.id}/edit`}>
                                                                    <DropdownMenuItem className="cursor-pointer">
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-red-400"
                                                                    onClick={() => handleDelete(item.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
