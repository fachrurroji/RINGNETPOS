import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6',
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: CardProps) {
    return <div className={cn('mb-5 pb-4 border-b border-slate-100', className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
    return (
        <h3 className={cn('text-base font-semibold text-slate-800', className)} {...props} />
    );
}

export function CardContent({ className, ...props }: CardProps) {
    return <div className={cn('', className)} {...props} />;
}
