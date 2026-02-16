'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { AlertTriangle, Package, CheckCircle } from 'lucide-react';

interface LowStockItem {
    id: string;
    sku: string;
    name: string;
    minStock: number;
    currentStock: number;
    deficit: number;
}

export default function LowStockPage() {
    const [data, setData] = useState<{ count: number; items: LowStockItem[] }>({ count: 0, items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await reportsApi.getLowStock();
                setData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Stok Menipis</h1>
                <p className="text-slate-500 text-sm mt-1">Produk yang perlu segera di-restock</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : data.count === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center py-16">
                        <div className="p-4 bg-emerald-50 rounded-2xl mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-800">Semua Stok Aman! 🎉</h3>
                        <p className="text-sm text-slate-500 mt-1">Tidak ada produk yang stoknya di bawah minimum</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-xl flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-red-800 text-sm">
                                {data.count} Produk Perlu Di-restock
                            </p>
                            <p className="text-xs text-red-600 mt-0.5">
                                Stok di bawah batas minimum yang ditentukan
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left">SKU</th>
                                        <th className="text-left">Nama Produk</th>
                                        <th className="text-right">Stok Saat Ini</th>
                                        <th className="text-right">Min. Stok</th>
                                        <th className="text-right">Kekurangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="font-mono text-xs text-slate-400">{item.sku}</td>
                                            <td className="font-medium text-slate-800">{item.name}</td>
                                            <td className="text-right">
                                                <span className={`font-semibold ${item.currentStock === 0
                                                    ? 'text-red-600'
                                                    : 'text-orange-600'
                                                    }`}>
                                                    {item.currentStock}
                                                </span>
                                            </td>
                                            <td className="text-right text-slate-500">
                                                {item.minStock}
                                            </td>
                                            <td className="text-right">
                                                <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium rounded-full">
                                                    -{item.deficit}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
