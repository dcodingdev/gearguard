'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { MaintenanceRequest } from '@/types';

interface UseRequestsOptions {
    status?: string;
    type?: string;
    teamId?: string;
    equipmentId?: string;
}

export function useRequests(options?: UseRequestsOptions) {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (options?.status) params.append('status', options.status);
            if (options?.type) params.append('type', options.type);
            if (options?.teamId) params.append('teamId', options.teamId);
            if (options?.equipmentId) params.append('equipmentId', options.equipmentId);

            const response = await api.get(`/requests?${params.toString()}`);
            setRequests(response.data);
        } catch (err) {
            setError('Failed to fetch requests');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [options?.status, options?.type, options?.teamId, options?.equipmentId]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const createRequest = async (data: Partial<MaintenanceRequest>) => {
        const response = await api.post('/requests', data);
        setRequests(prev => [...prev, response.data]);
        return response.data;
    };

    const updateRequest = async (id: string, data: Partial<MaintenanceRequest>) => {
        const response = await api.put(`/requests/${id}`, data);
        setRequests(prev => prev.map(r => r.id === id ? response.data : r));
        return response.data;
    };

    const deleteRequest = async (id: string) => {
        await api.delete(`/requests/${id}`);
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const updateStatus = async (id: string, status: string) => {
        return updateRequest(id, { status: status as MaintenanceRequest['status'] });
    };

    return {
        requests,
        isLoading,
        error,
        refetch: fetchRequests,
        createRequest,
        updateRequest,
        deleteRequest,
        updateStatus,
    };
}

export function useRequestById(id: string) {
    const [request, setRequest] = useState<MaintenanceRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/requests/${id}`);
                setRequest(response.data);
            } catch (err) {
                setError('Failed to fetch request');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchRequest();
        }
    }, [id]);

    return { request, isLoading, error };
}
