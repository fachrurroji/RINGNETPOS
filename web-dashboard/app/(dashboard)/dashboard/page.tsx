'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi, transactionsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Package, Wallet } from 'lucide-react';

interface DailyReport {
    date: string;
    totalRevenue: number;
    totalTransactions: number;
    totalMechanicFee: number;
    netRevenue: number;
}

export default function DashboardPage() {
    const [report, setReport] = useState<DailyReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await reportsApi.getDaily();
                setReport(data);
            } catch (error) {
                console.error('Failed to fetch report:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Omzet Hari Ini',
            value: formatCurrency(report?.totalRevenue || 0),
            icon: TrendingUp,
            color: 'bg-blue-500',
        },
        {
            title: 'Transaksi',
            value: report?.totalTransactions || 0,
            icon: Package,
            color: 'bg-green-500',
        },
        {
            title: 'Fee Mekanik',
            value: formatCurrency(report?.totalMechanicFee || 0),
            icon: Users,
            color: 'bg-orange-500',
        },
        {
            title: 'Laba Bersih',
            value: formatCurrency(report?.netRevenue || 0),
            icon: Wallet,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Selamat datang di Ring Pro Dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>📊 Statistik Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Tanggal</span>
                                <span className="font-medium">{report?.date}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Total Omzet</span>
                                <span className="font-medium text-blue-600">
                                    {formatCurrency(report?.totalRevenue || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Fee Mekanik</span>
                                <span className="font-medium text-orange-600">
                                    {formatCurrency(report?.totalMechanicFee || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-500">Laba Bersih</span>
                                <span className="font-bold text-green-600">
                                    {formatCurrency(report?.netRevenue || 0)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>🚀 Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="/reports/daily"
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                            >
                                <span className="text-2xl">📈</span>
                                <p className="text-sm font-medium mt-2">Laporan Harian</p>
                            </a>
                            <a
                                href="/reports/commission"
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                            >
                                <span className="text-2xl">💰</span>
                                <p className="text-sm font-medium mt-2">Komisi Mekanik</p>
                            </a>
                            <a
                                href="/master/products"
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                            >
                                <span className="text-2xl">📦</span>
                                <p className="text-sm font-medium mt-2">Produk</p>
                            </a>
                            <a
                                href="/master/mechanics"
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                            >
                                <span className="text-2xl">🔧</span>
                                <p className="text-sm font-medium mt-2">Mekanik</p>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
