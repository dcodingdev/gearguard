'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/lib/api';
import { MaintenanceRequest } from '@/types';

interface UseEquipmentRequestsOptions {
    equipmentId: string;
}

export function useEquipmentRequests({ equipmentId }: UseEquipmentRequestsOptions) {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        if (!equipmentId) {
            setRequests([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/requests?equipmentId=${equipmentId}`);
            setRequests(response.data);
        } catch (err) {
            setError('Failed to fetch equipment requests');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [equipmentId]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Count of new requests (not completed, cancelled, or scrapped)
    const openCount = useMemo(() => {
        return requests.filter(
            (r) => r.status === 'new' || r.status === 'in_progress'
        ).length;
    }, [requests]);

    return {
        requests,
        openCount,
        isLoading,
        error,
        refetch: fetchRequests,
    };
}

// Hook to get request counts for multiple equipment IDs at once
export function useEquipmentRequestCounts(equipmentIds: string[]) {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            if (equipmentIds.length === 0) {
                setCounts({});
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch all requests once
                const response = await api.get('/requests');
                const allRequests: MaintenanceRequest[] = response.data;

                // Group and count new requests by equipment ID
                const newCounts: Record<string, number> = {};
                for (const id of equipmentIds) {
                    newCounts[id] = allRequests.filter(
                        (r) =>
                            r.equipmentId === id &&
                            (r.status === 'new' || r.status === 'in_progress')
                    ).length;
                }
                setCounts(newCounts);
            } catch (err) {
                console.error('Failed to fetch request counts:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounts();
    }, [equipmentIds.join(',')]); // Re-run when IDs change

    return { counts, isLoading };
}
