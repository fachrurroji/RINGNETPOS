import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
                {
                    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30':
                        variant === 'primary',
                    'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400':
                        variant === 'secondary',
                    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md shadow-red-600/20':
                        variant === 'danger',
                    'text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:ring-slate-400':
                        variant === 'ghost',
                    'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-400':
                        variant === 'outline',
                },
                {
                    'px-3 py-1.5 text-xs': size === 'sm',
                    'px-4 py-2.5 text-sm': size === 'md',
                    'px-6 py-3 text-base': size === 'lg',
                },
                className
            )}
            {...props}
        />
    );
}
