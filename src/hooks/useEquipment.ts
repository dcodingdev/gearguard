'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Equipment } from '@/types';

interface UseEquipmentOptions {
    department?: string;
    status?: string;
    search?: string;
}

export function useEquipment(options?: UseEquipmentOptions) {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipment = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (options?.department) params.append('department', options.department);
            if (options?.status) params.append('status', options.status);
            if (options?.search) params.append('search', options.search);

            const response = await api.get(`/equipment?${params.toString()}`);
            setEquipment(response.data);
        } catch (err) {
            setError('Failed to fetch equipment');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [options?.department, options?.status, options?.search]);

    useEffect(() => {
        fetchEquipment();
    }, [fetchEquipment]);

    const createEquipment = async (data: Partial<Equipment>) => {
        const response = await api.post('/equipment', data);
        setEquipment(prev => [...prev, response.data]);
        return response.data;
    };

    const updateEquipment = async (id: string, data: Partial<Equipment>) => {
        const response = await api.put(`/equipment/${id}`, data);
        setEquipment(prev => prev.map(e => e.id === id ? response.data : e));
        return response.data;
    };

    const deleteEquipment = async (id: string) => {
        await api.delete(`/equipment/${id}`);
        setEquipment(prev => prev.filter(e => e.id !== id));
    };

    return {
        equipment,
        isLoading,
        error,
        refetch: fetchEquipment,
        createEquipment,
        updateEquipment,
        deleteEquipment,
    };
}

export function useEquipmentById(id: string) {
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/equipment/${id}`);
                setEquipment(response.data);
            } catch (err) {
                setError('Failed to fetch equipment');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEquipment();
        }
    }, [id]);

    return { equipment, isLoading, error };
}
