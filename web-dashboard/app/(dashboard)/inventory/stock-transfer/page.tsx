'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Plus, ArrowRight, Package, Building2 } from 'lucide-react';

interface Product {
    id: string;
    sku: string;
    name: string;
    type: string;
}

interface Branch {
    id: string;
    name: string;
}

interface StockTransfer {
    id: string;
    qty: number;
    notes: string | null;
    createdAt: string;
    product: { sku: string; name: string };
    fromBranch: { name: string };
    toBranch: { name: string };
    user: { username: string };
}

export default function StockTransferPage() {
    const [transfers, setTransfers] = useState<StockTransfer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        productId: '',
        fromBranchId: '',
        toBranchId: '',
        qty: 1,
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [transfersRes, productsRes, branchesRes] = await Promise.all([
                api.get('/stock-transfer'),
                api.get('/products'),
                api.get('/branches'),
            ]);
            setTransfers(transfersRes.data);
            setProducts(productsRes.data.filter((p: Product) => p.type === 'GOODS'));
            setBranches(branchesRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setForm({ productId: '', fromBranchId: '', toBranchId: '', qty: 1, notes: '' });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.fromBranchId === form.toBranchId) {
            setError('Cabang pengirim dan penerima harus berbeda');
            return;
        }

        setSaving(true);
        try {
            await api.post('/stock-transfer', form);
            setShowModal(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal transfer stok');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Transfer Stok</h1>
                    <p className="text-slate-500 text-sm mt-1">Pindahkan stok antar cabang</p>
                </div>
                <Button onClick={openModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Transfer Stok
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Transfer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {transfers.length === 0 ? (
                            <p className="text-slate-400 text-center py-12 text-sm">
                                Belum ada transfer stok
                            </p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left">Tanggal</th>
                                        <th className="text-left">Produk</th>
                                        <th className="text-center">Transfer</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-left">Oleh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transfers.map((transfer) => (
                                        <tr key={transfer.id}>
                                            <td className="text-sm text-slate-500">
                                                {new Date(transfer.createdAt).toLocaleString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td>
                                                <div>
                                                    <p className="font-medium text-slate-800">{transfer.product.name}</p>
                                                    <p className="text-xs text-slate-400">{transfer.product.sku}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-center gap-2 text-sm">
                                                    <span className="text-slate-600">{transfer.fromBranch.name}</span>
                                                    <ArrowRight className="w-4 h-4 text-blue-500" />
                                                    <span className="text-slate-600">{transfer.toBranch.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold rounded-full">
                                                    {transfer.qty}
                                                </span>
                                            </td>
                                            <td className="text-sm text-slate-500">{transfer.user.username}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl mx-4">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Transfer Stok</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Produk</label>
                                <select
                                    value={form.productId}
                                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                                    required
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                >
                                    <option value="">Pilih Produk</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.sku})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Dari Cabang</label>
                                    <select
                                        value={form.fromBranchId}
                                        onChange={(e) => setForm({ ...form, fromBranchId: e.target.value })}
                                        required
                                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                    >
                                        <option value="">Pilih</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Ke Cabang</label>
                                    <select
                                        value={form.toBranchId}
                                        onChange={(e) => setForm({ ...form, toBranchId: e.target.value })}
                                        required
                                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                    >
                                        <option value="">Pilih</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Jumlah</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.qty}
                                    onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 1 })}
                                    required
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan (opsional)</label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                    placeholder="Alasan transfer..."
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-3">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1" disabled={saving}>
                                    {saving ? 'Mengirim...' : 'Transfer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
