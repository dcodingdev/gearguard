'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { MaintenanceTeam } from '@/types';

export function useTeams() {
    const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeams = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/teams');
            setTeams(response.data);
        } catch (err) {
            setError('Failed to fetch teams');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const createTeam = async (data: Partial<MaintenanceTeam>) => {
        const response = await api.post('/teams', data);
        setTeams(prev => [...prev, response.data]);
        return response.data;
    };

    const updateTeam = async (id: string, data: Partial<MaintenanceTeam>) => {
        const response = await api.put(`/teams/${id}`, data);
        setTeams(prev => prev.map(t => t.id === id ? response.data : t));
        return response.data;
    };

    const deleteTeam = async (id: string) => {
        await api.delete(`/teams/${id}`);
        setTeams(prev => prev.filter(t => t.id !== id));
    };

    const addMember = async (teamId: string, member: Record<string, unknown>) => {
        const response = await api.post(`/teams/${teamId}/members`, member);
        setTeams(prev => prev.map(t => t.id === teamId ? response.data : t));
        return response.data;
    };

    const removeMember = async (teamId: string, memberId: string) => {
        const response = await api.delete(`/teams/${teamId}/members?memberId=${memberId}`);
        setTeams(prev => prev.map(t => t.id === teamId ? response.data : t));
        return response.data;
    };

    return {
        teams,
        isLoading,
        error,
        refetch: fetchTeams,
        createTeam,
        updateTeam,
        deleteTeam,
        addMember,
        removeMember,
    };
}

export function useTeamById(id: string) {
    const [team, setTeam] = useState<MaintenanceTeam | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeam = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/teams/${id}`);
                setTeam(response.data);
            } catch (err) {
                setError('Failed to fetch team');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchTeam();
        }
    }, [id]);

    return { team, isLoading, error };
}
