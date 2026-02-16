'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

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
    const [search, setSearch] = useState('');

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

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Produk</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola daftar produk dan jasa</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                </Button>
            </div>

            <div className="mb-5 relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari produk atau SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">SKU</th>
                                    <th className="text-left">Nama</th>
                                    <th className="text-center">Tipe</th>
                                    <th className="text-right">Harga Jual</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            {search ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((product) => (
                                        <tr key={product.id}>
                                            <td className="font-mono text-xs text-slate-500">{product.sku}</td>
                                            <td className="font-medium text-slate-800">{product.name}</td>
                                            <td className="text-center">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.type === 'GOODS'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                    {product.type === 'GOODS' ? 'Barang' : 'Jasa'}
                                                </span>
                                            </td>
                                            <td className="text-right text-slate-700">
                                                {product.isFlexiblePrice ? (
                                                    <span className="text-slate-400 italic text-xs">Fleksibel</span>
                                                ) : (
                                                    <span className="font-medium">{formatCurrency(product.sellPrice || 0)}</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex justify-center gap-1">
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                        <Pencil className="w-4 h-4 text-slate-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
