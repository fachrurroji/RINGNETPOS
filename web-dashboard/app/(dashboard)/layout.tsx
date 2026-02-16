'use client';

import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="pl-64">
                <div className="p-8 max-w-[1400px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
