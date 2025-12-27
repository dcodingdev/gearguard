'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wrench,
    Users,
    ClipboardList,
    Calendar,
    BarChart3,
    UserCog,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/equipment', label: 'Equipment', icon: Wrench },
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/requests', label: 'Requests', icon: ClipboardList },
    { href: '/requests/calendar', label: 'Calendar', icon: Calendar },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
];

const adminItems = [
    { href: '/users', label: 'User Management', icon: UserCog },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { hasRole } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
                {!isCollapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                            <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">GearGuard</span>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3">
                <div className="space-y-1">
                    {!isCollapsed && (
                        <span className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Main Menu
                        </span>
                    )}
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* Admin Section */}
                {hasRole(['admin']) && (
                    <div className="mt-6 space-y-1">
                        {!isCollapsed && (
                            <span className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Admin
                            </span>
                        )}
                        {adminItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>
        </aside>
    );
}
