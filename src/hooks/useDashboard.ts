'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DashboardStats } from '@/types';

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard stats');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, isLoading, error };
}
