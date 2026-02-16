'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Briefcase } from 'lucide-react';

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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Rekap Komisi Mekanik</h1>
                <p className="text-slate-500 text-sm mt-1">Laporan komisi per mekanik per bulan</p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bulan</label>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card className="border border-blue-100">
                            <CardContent className="flex items-center gap-4 py-5">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Wallet className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Total Komisi</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(data?.totalCommission || 0)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-emerald-100">
                            <CardContent className="flex items-center gap-4 py-5">
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <Briefcase className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Total Job</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {data?.totalJobs || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Per Mekanik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!data?.mechanics || data.mechanics.length === 0 ? (
                                <p className="text-slate-400 text-center py-12 text-sm">
                                    Tidak ada data untuk periode ini
                                </p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Nama Mekanik</th>
                                            <th className="text-left">Cabang</th>
                                            <th className="text-right">Total Job</th>
                                            <th className="text-right">Total Komisi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.mechanics.map((m) => (
                                            <tr key={m.mechanicId}>
                                                <td className="font-medium text-slate-800">{m.mechanicName}</td>
                                                <td className="text-slate-500">{m.branchName}</td>
                                                <td className="text-right text-slate-600">{m.totalJobs}</td>
                                                <td className="text-right font-semibold text-blue-600">
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
