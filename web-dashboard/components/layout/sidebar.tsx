'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    Wrench,
    Building2,
    LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/reports/daily', label: 'Laporan Harian', icon: FileText },
    { href: '/reports/commission', label: 'Komisi Mekanik', icon: Users },
    { href: '/master/branches', label: 'Cabang', icon: Building2 },
    { href: '/master/products', label: 'Produk', icon: Package },
    { href: '/master/mechanics', label: 'Mekanik', icon: Wrench },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold">🔧 Ring Pro</h1>
                <p className="text-xs text-gray-400 mt-1">Mechanic Edition</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                            {user?.username?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{user?.username}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
