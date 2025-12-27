'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { teamSchema, TeamSchemaType } from '@/schemas/team.schema';
import { useTeams } from '@/hooks/useTeams';
import { toast } from 'sonner';

export default function NewTeamPage() {
    const router = useRouter();
    const { createTeam } = useTeams();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TeamSchemaType>({
        resolver: zodResolver(teamSchema),
    });

    const onSubmit = async (data: TeamSchemaType) => {
        try {
            await createTeam(data);
            toast.success('Team created successfully');
            router.push('/teams');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create team');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/teams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Maintenance Team</h1>
                    <p className="text-slate-400">Form a new team of technicians</p>
                </div>
            </div>

            {/* Form */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Team Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300">
                                Team Name *
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Electrical Response Unit"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-400">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Specialization */}
                        <div className="space-y-2">
                            <Label htmlFor="specialization" className="text-slate-300">
                                Specialization *
                            </Label>
                            <Input
                                id="specialization"
                                placeholder="e.g., Electrical Systems"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('specialization')}
                            />
                            {errors.specialization && (
                                <p className="text-sm text-red-400">{errors.specialization.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-300">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the team's responsibilities..."
                                rows={4}
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-400">{errors.description.message}</p>
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
                                        Creating...
                                    </>
                                ) : (
                                    'Create Team'
                                )}
                            </Button>
                            <Link href="/teams">
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
