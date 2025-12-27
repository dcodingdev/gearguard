'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { equipmentSchema, EquipmentSchemaType } from '@/schemas/equipment.schema';
import { useEquipment } from '@/hooks/useEquipment';
import { useTeams } from '@/hooks/useTeams';
import { DEPARTMENTS, EQUIPMENT_CATEGORIES, EQUIPMENT_STATUS } from '@/constants';
import { toast } from 'sonner';

export default function NewEquipmentPage() {
    const router = useRouter();
    const { createEquipment } = useEquipment();
    const { teams } = useTeams();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            status: 'operational',
            purchaseDate: new Date().toISOString().split('T')[0],
        },
    });

    const selectedTeamId = watch('maintenanceTeamId');
    const selectedTeam = teams.find((t) => t.id === selectedTeamId);

    const onSubmit = async (data: EquipmentSchemaType) => {
        try {
            await createEquipment(data);
            toast.success('Equipment added successfully');
            router.push('/equipment');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add equipment');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/equipment">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Add Equipment</h1>
                    <p className="text-slate-400">Register new equipment or asset</p>
                </div>
            </div>

            {/* Form */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Equipment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name and Serial */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300">
                                    Name *
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., CNC Machine 01"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-400">{errors.name?.message as string}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="serialNumber" className="text-slate-300">
                                    Serial Number *
                                </Label>
                                <Input
                                    id="serialNumber"
                                    placeholder="e.g., SN-123456"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    {...register('serialNumber')}
                                />
                                {errors.serialNumber && (
                                    <p className="text-sm text-red-400">{errors.serialNumber?.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Category and Department */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Category *</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {EQUIPMENT_CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category && (
                                    <p className="text-sm text-red-400">{errors.category?.message as string}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Department *</Label>
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {DEPARTMENTS.map((dept) => (
                                                    <SelectItem key={dept.value} value={dept.value}>
                                                        {dept.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.department && (
                                    <p className="text-sm text-red-400">{errors.department?.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Location and Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-slate-300">
                                    Location *
                                </Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Warehouse A, Row 3"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    {...register('location')}
                                />
                                {errors.location && (
                                    <p className="text-sm text-red-400">{errors.location?.message as string}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Status *</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue="operational"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue="operational">
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {EQUIPMENT_STATUS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.status && (
                                    <p className="text-sm text-red-400">{errors.status?.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Team and Technician */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Maintenance Team *</Label>
                                <Controller
                                    name="maintenanceTeamId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select team" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {teams?.length > 0 ? (
                                                    teams.map((team) => (
                                                        <SelectItem key={team.id} value={team.id}>
                                                            {team.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-teams" disabled>
                                                        No teams available
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.maintenanceTeamId && (
                                    <p className="text-sm text-red-400">{errors.maintenanceTeamId?.message as string}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Default Technician *</Label>
                                <Controller
                                    name="defaultTechnicianId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={!selectedTeamId}
                                        >
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder="Select technician" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {selectedTeam?.members.map((member) => (
                                                    <SelectItem key={member.userId} value={member.userId}>
                                                        {member.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.defaultTechnicianId && (
                                    <p className="text-sm text-red-400">{errors.defaultTechnicianId?.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate" className="text-slate-300">
                                    Purchase Date *
                                </Label>
                                <Input
                                    id="purchaseDate"
                                    type="date"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    {...register('purchaseDate')}
                                />
                                {errors.purchaseDate && (
                                    <p className="text-sm text-red-400">{errors.purchaseDate?.message as string}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="warrantyExpiry" className="text-slate-300">
                                    Warranty Expiry
                                </Label>
                                <Input
                                    id="warrantyExpiry"
                                    type="date"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    {...register('warrantyExpiry')}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-slate-300">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Additional details..."
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('notes')}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-400">{errors.notes?.message as string}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add Equipment'
                                )}
                            </Button>
                            <Link href="/equipment">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

