'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

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

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Laporan Harian</h1>
                <p className="text-gray-500">Detail omzet dan transaksi per hari</p>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardContent className="text-center py-4">
                                <p className="text-sm text-gray-500">Omzet</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(data?.totalRevenue || 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="text-center py-4">
                                <p className="text-sm text-gray-500">Transaksi</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {data?.totalTransactions || 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="text-center py-4">
                                <p className="text-sm text-gray-500">Fee Mekanik</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(data?.totalMechanicFee || 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="text-center py-4">
                                <p className="text-sm text-gray-500">Laba Bersih</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(data?.netRevenue || 0)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transactions Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data?.transactions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Tidak ada transaksi pada tanggal ini
                                </p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">
                                                ID
                                            </th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">
                                                Cabang
                                            </th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">
                                                Plat
                                            </th>
                                            <th className="text-right py-3 text-sm font-medium text-gray-500">
                                                Total
                                            </th>
                                            <th className="text-center py-3 text-sm font-medium text-gray-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.transactions.map((t) => (
                                            <tr key={t.id} className="border-b">
                                                <td className="py-3 font-mono text-sm">
                                                    {t.id.slice(0, 8)}...
                                                </td>
                                                <td className="py-3">{t.branch?.name || '-'}</td>
                                                <td className="py-3">{t.customerPlate || '-'}</td>
                                                <td className="py-3 text-right font-medium">
                                                    {formatCurrency(t.totalAmount)}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${t.status === 'PAID'
                                                                ? 'bg-green-100 text-green-700'
                                                                : t.status === 'CANCELLED'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {t.status}
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
            )}
        </div>
    );
}
