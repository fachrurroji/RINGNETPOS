'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Product {
    id: string;
    sku: string;
    name: string;
    type: string;
    basePrice: number;
    sellPrice: number | null;
    isFlexiblePrice: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await productsApi.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin hapus produk ini?')) return;
        try {
            await productsApi.delete(id);
            fetchProducts();
        } catch (error) {
            alert('Gagal menghapus produk');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
                    <p className="text-gray-500">Kelola daftar produk dan jasa</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        SKU
                                    </th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        Nama
                                    </th>
                                    <th className="text-center py-3 text-sm font-medium text-gray-500">
                                        Tipe
                                    </th>
                                    <th className="text-right py-3 text-sm font-medium text-gray-500">
                                        Harga Jual
                                    </th>
                                    <th className="text-center py-3 text-sm font-medium text-gray-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b">
                                        <td className="py-3 font-mono text-sm">{product.sku}</td>
                                        <td className="py-3 font-medium">{product.name}</td>
                                        <td className="py-3 text-center">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${product.type === 'GOODS'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {product.type}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            {product.isFlexiblePrice ? (
                                                <span className="text-gray-500 italic">Fleksibel</span>
                                            ) : (
                                                formatCurrency(product.sellPrice || 0)
                                            )}
                                        </td>
                                        <td className="py-3">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded">
                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-gray-100 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
