'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { requestSchema, RequestSchemaType } from '@/schemas/request.schema';
import { useRequests } from '@/hooks/useRequests';
import { useEquipment } from '@/hooks/useEquipment';
import { useTeams } from '@/hooks/useTeams';
import { REQUEST_TYPES, REQUEST_PRIORITY } from '@/constants';
import { toast } from 'sonner';

export default function NewRequestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const { createRequest } = useRequests();
    const { equipment } = useEquipment();
    const { teams } = useTeams();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RequestSchemaType>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            status: 'new',
            scheduledDate: defaultDate,
            priority: 'medium',
            type: 'corrective',
        },
    });

    const selectedTeamId = watch('teamId');
    const selectedTeam = teams.find((t) => t.id === selectedTeamId);

    const onSubmit = async (data: RequestSchemaType) => {
        try {
            await createRequest(data as unknown as Partial<import('@/types').MaintenanceRequest>);
            toast.success('Request created successfully');
            router.push('/requests');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create request');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/requests">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Maintenance Request</h1>
                    <p className="text-slate-400">Submit a new maintenance work order</p>
                </div>
            </div>

            {/* Form */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-slate-300">
                                Subject *
                            </Label>
                            <Input
                                id="subject"
                                placeholder="e.g., Oil leak in CNC Machine"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('subject')}
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-400">{errors.subject.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-300">
                                Description *
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the issue or maintenance needed..."
                                rows={4}
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-400">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Type and Priority Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Request Type *</Label>
                                <Select
                                    onValueChange={(value) => setValue('type', value as RequestSchemaType['type'])}
                                    defaultValue="corrective"
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {REQUEST_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div>
                                                    <span>{type.label}</span>
                                                    <span className="text-xs text-slate-400 block">
                                                        {type.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-400">{errors.type.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Priority *</Label>
                                <Select
                                    onValueChange={(value) => setValue('priority', value as RequestSchemaType['priority'])}
                                    defaultValue="medium"
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {REQUEST_PRIORITY.map((priority) => (
                                            <SelectItem key={priority.value} value={priority.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                                                    {priority.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.priority && (
                                    <p className="text-sm text-red-400">{errors.priority.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Equipment */}
                        <div className="space-y-2">
                            <Label className="text-slate-300">Equipment *</Label>
                            <Select
                                value={watch('equipmentId')}
                                onValueChange={(value) => {
                                    setValue('equipmentId', value);
                                    const selectedEq = equipment.find(e => e.id === value);
                                    if (selectedEq) {
                                        setValue('teamId', selectedEq.maintenanceTeamId);
                                        // Trigger validation/touch if needed
                                    }
                                }}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                    <SelectValue placeholder="Select equipment" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    {equipment.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            <div>
                                                <span>{item.name}</span>
                                                <span className="text-xs text-slate-400 ml-2">
                                                    ({item.serialNumber})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.equipmentId && (
                                <p className="text-sm text-red-400">{errors.equipmentId.message}</p>
                            )}
                        </div>

                        {/* Auto-filled Category Display */}
                        {watch('equipmentId') && (
                            <div className="space-y-2">
                                <Label className="text-slate-300">Equipment Category</Label>
                                <div className="px-3 py-2 rounded-md bg-slate-800/50 border border-slate-700 text-slate-400">
                                    {equipment.find(e => e.id === watch('equipmentId'))?.category || 'Unknown'}
                                </div>
                            </div>
                        )}

                        {/* Team and Technician Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Maintenance Team *</Label>
                                <Select
                                    value={watch('teamId')}
                                    onValueChange={(value) => setValue('teamId', value)}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id}>
                                                <div>
                                                    <span>{team.name}</span>
                                                    <span className="text-xs text-slate-400 ml-2">
                                                        ({team.members.length} members)
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teamId && (
                                    <p className="text-sm text-red-400">{errors.teamId.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Assign Technician</Label>
                                <Select
                                    value={watch('assignedTechnicianId')}
                                    onValueChange={(value) => setValue('assignedTechnicianId', value)}
                                    disabled={!selectedTeamId}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select technician" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {selectedTeam?.members.map((member) => (
                                            <SelectItem key={member.userId} value={member.userId}>
                                                <div className="flex items-center gap-2">
                                                    <span>{member.name}</span>
                                                    {!member.isAvailable && (
                                                        <span className="text-xs text-amber-400">(Busy)</span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Scheduled Date */}
                        <div className="space-y-2">
                            <Label htmlFor="scheduledDate" className="text-slate-300">
                                Scheduled Date *
                            </Label>
                            <Input
                                id="scheduledDate"
                                type="date"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('scheduledDate')}
                            />
                            {errors.scheduledDate && (
                                <p className="text-sm text-red-400">{errors.scheduledDate.message}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-slate-300">
                                Additional Notes
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Any additional information..."
                                rows={3}
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('notes')}
                            />
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
                                        Creating...
                                    </>
                                ) : (
                                    'Create Request'
                                )}
                            </Button>
                            <Link href="/requests">
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
