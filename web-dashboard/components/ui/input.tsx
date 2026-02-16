import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    className={cn(
                        'w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200',
                        error ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300 hover:border-slate-400',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
