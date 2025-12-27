// Simple localStorage-based storage utility
// In production, replace with actual database calls

const isServer = typeof window === 'undefined';

export function getStorageItem<T>(key: string): T | null {
    if (isServer) return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
}

export function setStorageItem<T>(key: string, value: T): void {
    if (isServer) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

export function removeStorageItem(key: string): void {
    if (isServer) return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

// Storage keys
export const STORAGE_KEYS = {
    USERS: 'gearguard_users',
    EQUIPMENT: 'gearguard_equipment',
    TEAMS: 'gearguard_teams',
    REQUESTS: 'gearguard_requests',
    ACTIVITY_LOG: 'gearguard_activity_log',
    AUTH_TOKEN: 'gearguard_auth_token',
    CURRENT_USER: 'gearguard_current_user',
};
