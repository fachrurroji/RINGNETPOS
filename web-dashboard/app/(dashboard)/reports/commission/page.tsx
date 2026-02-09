'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface CommissionData {
    period: { startDate: string; endDate: string };
    totalCommission: number;
    totalJobs: number;
    mechanics: {
        mechanicId: string;
        mechanicName: string;
        branchName: string;
        totalJobs: number;
        totalCommission: number;
    }[];
}

export default function CommissionReportPage() {
    const [data, setData] = useState<CommissionData | null>(null);
    const [month, setMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await reportsApi.getMechanicCommission(month);
                setData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [month]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Rekap Komisi Mekanik</h1>
                <p className="text-gray-500">Laporan komisi per mekanik per bulan</p>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bulan
                </label>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <CardContent className="flex flex-col items-center py-6">
                                <p className="text-sm text-gray-500">Total Komisi</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(data?.totalCommission || 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col items-center py-6">
                                <p className="text-sm text-gray-500">Total Job</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {data?.totalJobs || 0}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mechanics Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Per Mekanik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data?.mechanics.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Tidak ada data untuk periode ini
                                </p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">
                                                Nama Mekanik
                                            </th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">
                                                Cabang
                                            </th>
                                            <th className="text-right py-3 text-sm font-medium text-gray-500">
                                                Total Job
                                            </th>
                                            <th className="text-right py-3 text-sm font-medium text-gray-500">
                                                Total Komisi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.mechanics.map((m) => (
                                            <tr key={m.mechanicId} className="border-b">
                                                <td className="py-3 font-medium">{m.mechanicName}</td>
                                                <td className="py-3 text-gray-500">{m.branchName}</td>
                                                <td className="py-3 text-right">{m.totalJobs}</td>
                                                <td className="py-3 text-right font-medium text-blue-600">
                                                    {formatCurrency(m.totalCommission)}
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
