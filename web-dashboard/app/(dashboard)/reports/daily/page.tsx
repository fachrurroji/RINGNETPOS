'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, ShoppingCart, Users, Wallet } from 'lucide-react';

interface DailyReport {
    date: string;
    totalRevenue: number;
    totalTransactions: number;
    totalMechanicFee: number;
    netRevenue: number;
    transactions: any[];
}

export default function DailyReportPage() {
    const [data, setData] = useState<DailyReport | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await reportsApi.getDaily(date);
                setData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date]);

    const summaryCards = [
        { title: 'Omzet', value: formatCurrency(data?.totalRevenue || 0), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { title: 'Transaksi', value: String(data?.totalTransactions || 0), icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { title: 'Fee Mekanik', value: formatCurrency(data?.totalMechanicFee || 0), icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        { title: 'Laba Bersih', value: formatCurrency(data?.netRevenue || 0), icon: Wallet, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Laporan Harian</h1>
                <p className="text-slate-500 text-sm mt-1">Detail omzet dan transaksi per hari</p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {summaryCards.map((card, i) => (
                            <Card key={i} className={`border ${card.border}`}>
                                <CardContent className="flex items-center gap-4 py-4">
                                    <div className={`p-2.5 rounded-xl ${card.bg}`}>
                                        <card.icon className={`w-5 h-5 ${card.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">{card.title}</p>
                                        <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!data?.transactions || data.transactions.length === 0 ? (
                                <p className="text-slate-400 text-center py-12 text-sm">
                                    Tidak ada transaksi pada tanggal ini
                                </p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left">ID</th>
                                            <th className="text-left">Cabang</th>
                                            <th className="text-left">Plat</th>
                                            <th className="text-right">Total</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.transactions.map((t: any) => (
                                            <tr key={t.id}>
                                                <td>
                                                    <Link
                                                        href={`/transactions/${t.id}`}
                                                        className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                        {t.id.slice(0, 8)}...
                                                    </Link>
                                                </td>

                                                <td className="text-slate-600">{t.branch?.name || '-'}</td>
                                                <td className="text-slate-600">{t.customerPlate || '-'}</td>
                                                <td className="text-right font-semibold text-slate-800">
                                                    {formatCurrency(t.totalAmount)}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.status === 'PAID'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : t.status === 'CANCELLED'
                                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                        {t.status === 'PAID' ? 'Lunas' : t.status === 'CANCELLED' ? 'Batal' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </>
            )
            }
        </div >
    );
}
