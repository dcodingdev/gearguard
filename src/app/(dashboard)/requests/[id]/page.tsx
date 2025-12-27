'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save, Trash2, Clock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRequestById, useRequests } from '@/hooks/useRequests';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import { requestSchema, RequestSchemaType } from '@/schemas/request.schema';
import { REQUEST_STATUS, REQUEST_PRIORITY } from '@/constants';
import { toast } from 'sonner';
import { z } from 'zod';

// Extend schema for edit mode (some fields might be stricter or looser)
const editSchema = requestSchema.extend({
    // We might want to enforce duration if status is completed
    duration: z.number().optional().refine((val) => {
        return true; // We'll handle custom validation in onSubmit or refinement
    }),
});

export default function RequestDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const { request, isLoading: isLoadingRequest } = useRequestById(id);
    const { updateRequest, deleteRequest } = useRequests();
    const { teams } = useTeams();
    const { user } = useAuth(); // Assuming useAuth gives us current user info

    // We can't initialize form until we have the data
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequestSchemaType>({
        resolver: zodResolver(requestSchema),
    });

    useEffect(() => {
        if (request) {
            reset({
                subject: request.subject,
                description: request.description,
                type: request.type,
                priority: request.priority,
                equipmentId: request.equipmentId,
                teamId: request.teamId,
                assignedTechnicianId: request.assignedTechnicianId,
                status: request.status,
                scheduledDate: request.scheduledDate,
                duration: request.duration || 0,
                notes: request.notes,
            });
        }
    }, [request, reset]);

    const selectedTeamId = watch('teamId');
    const selectedTeam = teams.find((t) => t.id === selectedTeamId);
    const currentStatus = watch('status');

    const onSubmit = async (data: RequestSchemaType) => {
        try {
            // Business Logic: If moving to Repaired/Completed, require Duration
            if ((data.status === 'repaired') && (!data.duration || data.duration <= 0)) {
                toast.error('Please record the Hours Spent (Duration) before completing the request.');
                return;
            }

            await updateRequest(id, data as unknown as Partial<import('@/types').MaintenanceRequest>);
            toast.success('Request updated successfully');
            router.push('/requests');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update request');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRequest(id);
            toast.success('Request deleted');
            router.push('/requests');
        } catch (error) {
            toast.error('Failed to delete request');
        }
    };

    const handleAssignSelf = () => {
        if (user) {
            setValue('assignedTechnicianId', user.id);
            if (watch('status') === 'new') {
                setValue('status', 'in_progress');
            }
            toast.info('Assigned to you');
        }
    };

    if (isLoadingRequest) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-slate-400">Request not found</p>
                <Link href="/requests">
                    <Button variant="outline">Go Back</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/requests">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white">Ref #{id.substring(0, 8)}</h1>
                            <Badge variant="outline" className="uppercase">
                                {request.type}
                            </Badge>
                        </div>
                        <p className="text-slate-400">{request.subject}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the maintenance request.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Request Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="request-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Description</Label>
                                    <Textarea
                                        {...register('description')}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Status</Label>
                                        <Select value={watch('status')} onValueChange={(val) => setValue('status', val as any)}>
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {REQUEST_STATUS.map(s => (
                                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Priority</Label>
                                        <Select value={watch('priority')} onValueChange={(val) => setValue('priority', val as any)}>
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {REQUEST_PRIORITY.map(p => (
                                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Execution Duration (Hours)
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.5"
                                        placeholder="0.0"
                                        {...register('duration', { valueAsNumber: true })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                    <p className="text-xs text-slate-500">Required when completing the request.</p>
                                    {errors.duration && <p className="text-red-400 text-sm">{errors.duration.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">Notes</Label>
                                    <Textarea
                                        {...register('notes')}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        placeholder="Internal notes..."
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Assignment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Maintenance Team</Label>
                                <Select value={watch('teamId')} onValueChange={(val) => setValue('teamId', val)}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {teams.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Technician</Label>
                                <Select value={watch('assignedTechnicianId')} onValueChange={(val) => setValue('assignedTechnicianId', val)}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Unassigned" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="unassigned">Unassigned</SelectItem>
                                        {selectedTeam?.members.map(m => (
                                            <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleAssignSelf}
                            >
                                <UserIcon className="w-4 h-4 mr-2" />
                                Assign to Me
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Scheduling</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Scheduled Date</Label>
                                <Input
                                    type="date"
                                    {...register('scheduledDate')}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        form="request-form"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
