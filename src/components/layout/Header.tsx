'use client';

import { Bell, Search, LogOut, User, Settings, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

export function Header() {
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotifications();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'manager':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'technician':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getNotificationIcon = (action: string) => {
        if (action.includes('created')) return <Info className="h-4 w-4 text-blue-400" />;
        if (action.includes('updated')) return <Clock className="h-4 w-4 text-amber-400" />;
        if (action.includes('completed') || action.includes('repaired')) return <CheckCircle2 className="h-4 w-4 text-green-400" />;
        if (action.includes('scrapped') || action.includes('deleted')) return <AlertTriangle className="h-4 w-4 text-red-400" />;
        return <Bell className="h-4 w-4 text-slate-400" />;
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-6">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                        placeholder="Search equipment, requests..."
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-800 relative"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800 shadow-xl overflow-hidden p-0">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <DropdownMenuLabel className="p-0 text-white">Notifications</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                    {unreadCount} new
                                </Badge>
                            )}
                        </div>
                        <ScrollArea className="h-[350px]">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-800">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    {getNotificationIcon(notification.action)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm text-slate-200 group-hover:text-white transition-colors">
                                                        <span className="font-medium text-blue-400">{notification.userName}</span>{' '}
                                                        {notification.action}
                                                    </p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Bell className="h-10 w-10 text-slate-700 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm text-slate-500">No new notifications</p>
                                </div>
                            )}
                        </ScrollArea>
                        <DropdownMenuSeparator className="bg-slate-800 m-0" />
                        <Link href="/reports" className="block p-3 text-center text-sm text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition-colors">
                            View all activity
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 px-2 hover:bg-slate-800"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                                    {user ? getInitials(user.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium text-white">
                                    {user?.name || 'User'}
                                </span>
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1.5 py-0 h-4 ${getRoleBadgeColor(user?.role || '')}`}
                                >
                                    {user?.role || 'Guest'}
                                </Badge>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-slate-800 border-slate-700 text-white"
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem className="focus:bg-slate-700 cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700 cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                            className="focus:bg-slate-700 cursor-pointer text-red-400"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
