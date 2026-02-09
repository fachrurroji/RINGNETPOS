'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { reportsApi } from '@/lib/api';
import { AlertTriangle, Package } from 'lucide-react';

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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Stok Menipis</h1>
                <p className="text-gray-500">Produk yang perlu segera di-restock</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : data.count === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center py-12">
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <Package className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Semua Stok Aman! 🎉</h3>
                        <p className="text-gray-500 mt-1">Tidak ada produk yang stoknya di bawah minimum</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Summary */}
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-red-800">
                                {data.count} Produk Perlu Di-restock
                            </p>
                            <p className="text-sm text-red-600">
                                Stok di bawah batas minimum yang ditentukan
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 text-sm font-medium text-gray-500">
                                            SKU
                                        </th>
                                        <th className="text-left py-3 text-sm font-medium text-gray-500">
                                            Nama Produk
                                        </th>
                                        <th className="text-right py-3 text-sm font-medium text-gray-500">
                                            Stok Saat Ini
                                        </th>
                                        <th className="text-right py-3 text-sm font-medium text-gray-500">
                                            Min. Stok
                                        </th>
                                        <th className="text-right py-3 text-sm font-medium text-gray-500">
                                            Kekurangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-3 font-mono text-sm">{item.sku}</td>
                                            <td className="py-3 font-medium">{item.name}</td>
                                            <td className="py-3 text-right">
                                                <span className={`font-medium ${item.currentStock === 0
                                                        ? 'text-red-600'
                                                        : 'text-orange-600'
                                                    }`}>
                                                    {item.currentStock}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right text-gray-500">
                                                {item.minStock}
                                            </td>
                                            <td className="py-3 text-right">
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
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
