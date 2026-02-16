'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Users,
    UserCog,
    Package,
    Wrench,
    Building2,
    CreditCard,
    LogOut,
    ChevronRight,
    AlertTriangle,
    ArrowLeftRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

const menuSections = [
    {
        title: 'Menu Utama',
        items: [
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Laporan',
        items: [
            { href: '/reports/daily', label: 'Laporan Harian', icon: FileText },
            { href: '/reports/commission', label: 'Komisi Mekanik', icon: Users },
            { href: '/reports/low-stock', label: 'Stok Menipis', icon: AlertTriangle },
        ],
    },
    {
        title: 'Master Data',
        items: [
            { href: '/master/products', label: 'Produk', icon: Package },
            { href: '/master/mechanics', label: 'Mekanik', icon: Wrench },
            { href: '/master/branches', label: 'Cabang', icon: Building2 },
            { href: '/inventory/stock-transfer', label: 'Transfer Stok', icon: ArrowLeftRight },
            { href: '/master/users', label: 'Karyawan', icon: UserCog },
        ],
    },
    {
        title: 'Pengaturan',
        items: [
            { href: '/settings/billing', label: 'Billing', icon: CreditCard },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shadow-sidebar z-50">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight">Ring Pro</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Mechanic Edition</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                {menuSections.map((section) => (
                    <div key={section.title}>
                        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {section.title}
                        </p>
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                        )}
                                    >
                                        <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')} />
                                        <span className="flex-1">{item.label}</span>
                                        {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User */}
            <div className="px-4 py-4 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/20">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{user?.username || 'User'}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{user?.role || 'Role'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-red-400 transition-colors w-full px-1 py-1.5 rounded-md hover:bg-slate-800"
                >
                    <LogOut className="w-4 h-4" />
                    Keluar
                </button>
            </div>
        </aside>
    );
}
