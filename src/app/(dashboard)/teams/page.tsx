'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Users, Wrench, Zap, Monitor, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/context/AuthContext';

const getTeamIcon = (specialization: string) => {
    const lower = specialization.toLowerCase();
    if (lower.includes('mechanic') || lower.includes('machine')) return <Wrench className="h-5 w-5" />;
    if (lower.includes('electric')) return <Zap className="h-5 w-5" />;
    if (lower.includes('it') || lower.includes('computer')) return <Monitor className="h-5 w-5" />;
    if (lower.includes('facilit') || lower.includes('building')) return <Building className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
};

const getTeamColor = (index: number) => {
    const colors = [
        'from-blue-500 to-blue-600',
        'from-amber-500 to-amber-600',
        'from-purple-500 to-purple-600',
        'from-green-500 to-green-600',
        'from-pink-500 to-pink-600',
        'from-cyan-500 to-cyan-600',
    ];
    return colors[index % colors.length];
};

export default function TeamsPage() {
    const { teams, isLoading } = useTeams();
    const { hasRole } = useAuth();

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
                    <h1 className="text-2xl font-bold text-white">Maintenance Teams</h1>
                    <p className="text-slate-400">Manage your maintenance teams and technicians</p>
                </div>
                {hasRole(['admin', 'manager']) && (
                    <Link href="/teams/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Team
                        </Button>
                    </Link>
                )}
            </div>

            {/* Teams Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team, index) => (
                    <Card
                        key={team.id}
                        className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-3 rounded-xl bg-gradient-to-br ${getTeamColor(index)} shadow-lg`}
                                    >
                                        {getTeamIcon(team.specialization)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">{team.name}</CardTitle>
                                        <p className="text-sm text-slate-400">{team.specialization}</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {team.description && (
                                <p className="text-sm text-slate-400 mb-4">{team.description}</p>
                            )}

                            {/* Members */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-300">Team Members</span>
                                    <Badge variant="outline" className="text-slate-400">
                                        {team.members.length} members
                                    </Badge>
                                </div>

                                {team.members.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {team.members.slice(0, 4).map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-800"
                                            >
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs bg-slate-700">
                                                        {member.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')
                                                            .slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-slate-300">{member.name}</span>
                                                {member.role === 'lead' && (
                                                    <Badge className="h-4 px-1 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                                                        Lead
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                        {team.members.length > 4 && (
                                            <div className="flex items-center px-2 py-1 rounded-lg bg-slate-800">
                                                <span className="text-sm text-slate-400">
                                                    +{team.members.length - 4} more
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No members assigned</p>
                                )}

                                {/* Available Status */}
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="flex -space-x-2">
                                        {team.members
                                            .filter((m) => m.isAvailable)
                                            .slice(0, 3)
                                            .map((member) => (
                                                <Avatar
                                                    key={member.id}
                                                    className="h-7 w-7 border-2 border-slate-900"
                                                >
                                                    <AvatarFallback className="text-xs bg-green-600">
                                                        {member.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                    </div>
                                    <span className="text-sm text-green-400">
                                        {team.members.filter((m) => m.isAvailable).length} available
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <Link href={`/teams/${team.id}`}>
                                    <Button variant="outline" className="w-full">
                                        View Team
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {teams.length === 0 && (
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Teams Yet</h3>
                        <p className="text-slate-400 mb-4">Create your first maintenance team to get started</p>
                        {hasRole(['admin', 'manager']) && (
                            <Link href="/teams/new">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Team
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
