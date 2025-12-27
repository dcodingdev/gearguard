'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async (data: any) => {
        const response = await api.post('/users', data);
        setUsers(prev => [...prev, response.data]);
        return response.data;
    };

    const updateUser = async (id: string, data: any) => {
        const response = await api.put(`/users/${id}`, data);
        setUsers(prev => prev.map(u => u.id === id ? response.data : u));
        return response.data;
    };

    const deleteUser = async (id: string) => {
        await api.delete(`/users/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return {
        users,
        isLoading,
        error,
        refetch: fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    };
}

export function useUserById(id: string) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/users/${id}`);
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    return { user, isLoading, error };
}
