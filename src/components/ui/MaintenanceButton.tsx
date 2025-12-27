'use client';

import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MaintenanceButtonProps {
    equipmentId: string;
    openRequestCount: number;
    variant?: 'default' | 'compact';
}

export function MaintenanceButton({
    equipmentId,
    openRequestCount,
    variant = 'default',
}: MaintenanceButtonProps) {
    if (variant === 'compact') {
        return (
            <Link href={`/requests?equipmentId=${equipmentId}`}>
                <Button
                    variant="outline"
                    size="sm"
                    className="relative h-8 px-3 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-blue-500/50 transition-all"
                >
                    <Wrench className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Maintenance</span>
                    {openRequestCount > 0 && (
                        <Badge
                            className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        >
                            {openRequestCount > 99 ? '99+' : openRequestCount}
                        </Badge>
                    )}
                </Button>
            </Link>
        );
    }

    return (
        <Link href={`/requests?equipmentId=${equipmentId}`}>
            <Button
                variant="outline"
                className="relative bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-blue-500/50 transition-all group"
            >
                <Wrench className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
                <span>Maintenance</span>
                {openRequestCount > 0 && (
                    <Badge
                        className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1.5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
                    >
                        {openRequestCount > 99 ? '99+' : openRequestCount}
                    </Badge>
                )}
            </Button>
        </Link>
    );
}
