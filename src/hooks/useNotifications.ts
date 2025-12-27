'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { ActivityLog } from '@/types';

export function useNotifications() {
    const [notifications, setNotifications] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
            // For now, let's just say half are "unread" for demo purposes, 
            // or we could track this in local storage
            setUnreadCount(3);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    return {
        notifications,
        isLoading,
        unreadCount,
        markAllAsRead,
        refetch: fetchNotifications
    };
}
