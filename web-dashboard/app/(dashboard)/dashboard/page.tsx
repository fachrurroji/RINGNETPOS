'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Package, Wallet, AlertTriangle, ArrowUpRight, FileText, Wrench } from 'lucide-react';
import Link from 'next/link';

interface DailyReport {
    date: string;
    totalRevenue: number;
    totalTransactions: number;
    totalMechanicFee: number;
    netRevenue: number;
}

interface LowStockItem {
    id: string;
    sku: string;
    name: string;
    minStock: number;
    currentStock: number;
    deficit: number;
}

export default function DashboardPage() {
    const [report, setReport] = useState<DailyReport | null>(null);
    const [lowStock, setLowStock] = useState<{ count: number; items: LowStockItem[] }>({ count: 0, items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dailyRes, lowStockRes] = await Promise.all([
                    reportsApi.getDaily(),
                    reportsApi.getLowStock(),
                ]);
                setReport(dailyRes.data);
                setLowStock(lowStockRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const stats = [
        {
            title: 'Omzet Hari Ini',
            value: formatCurrency(report?.totalRevenue || 0),
            icon: TrendingUp,
            gradient: 'from-blue-600 to-blue-700',
            shadow: 'shadow-blue-600/25',
            iconBg: 'bg-blue-500/30',
        },
        {
            title: 'Total Transaksi',
            value: String(report?.totalTransactions || 0),
            icon: Package,
            gradient: 'from-emerald-600 to-emerald-700',
            shadow: 'shadow-emerald-600/25',
            iconBg: 'bg-emerald-500/30',
        },
        {
            title: 'Fee Mekanik',
            value: formatCurrency(report?.totalMechanicFee || 0),
            icon: Users,
            gradient: 'from-amber-500 to-orange-600',
            shadow: 'shadow-orange-600/25',
            iconBg: 'bg-amber-400/30',
        },
        {
            title: 'Laba Bersih',
            value: formatCurrency(report?.netRevenue || 0),
            icon: Wallet,
            gradient: 'from-violet-600 to-purple-700',
            shadow: 'shadow-violet-600/25',
            iconBg: 'bg-violet-500/30',
        },
    ];

    const quickActions = [
        { href: '/reports/daily', label: 'Laporan Harian', icon: FileText, emoji: '📈' },
        { href: '/reports/commission', label: 'Komisi Mekanik', icon: Users, emoji: '💰' },
        { href: '/master/products', label: 'Produk', icon: Package, emoji: '📦' },
        { href: '/master/mechanics', label: 'Mekanik', icon: Wrench, emoji: '🔧' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Selamat datang di Ring Pro Dashboard</p>
            </div>

            {/* Low Stock Alert */}
            {lowStock.count > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
                    <div className="p-2.5 bg-red-100 rounded-xl flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-red-800 text-sm">
                            {lowStock.count} Produk Stok Menipis
                        </h3>
                        <p className="text-xs text-red-600 mt-0.5">
                            {lowStock.items.slice(0, 3).map(item => item.name).join(', ')}
                            {lowStock.count > 3 && ` dan ${lowStock.count - 3} lainnya`}
                        </p>
                        <Link
                            href="/reports/low-stock"
                            className="text-xs text-red-700 font-semibold hover:underline mt-2 inline-flex items-center gap-1"
                        >
                            Lihat Detail <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 text-white shadow-lg ${stat.shadow} transition-transform hover:scale-[1.02]`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{stat.title}</p>
                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>📊 Statistik Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-0">
                            <div className="flex justify-between py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500">Tanggal</span>
                                <span className="text-sm font-medium text-slate-800">{report?.date || '-'}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500">Total Omzet</span>
                                <span className="text-sm font-semibold text-blue-600">
                                    {formatCurrency(report?.totalRevenue || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500">Fee Mekanik</span>
                                <span className="text-sm font-semibold text-orange-600">
                                    {formatCurrency(report?.totalMechanicFee || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-sm text-slate-500">Laba Bersih</span>
                                <span className="text-sm font-bold text-emerald-600">
                                    {formatCurrency(report?.netRevenue || 0)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>🚀 Akses Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-center"
                                >
                                    <span className="text-2xl block mb-2">{action.emoji}</span>
                                    <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                                        {action.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
