'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, RotateCcw, X } from 'lucide-react';

interface TransactionDetail {
    id: string;
    qty: number;
    priceAtMoment: number;
    mechanicFee: number | null;
    subtotal: number;
    product: { sku: string; name: string; type: string };
    mechanic: { name: string } | null;
    returns: {
        id: string;
        qty: number;
        reason: string;
        notes: string | null;
        createdAt: string;
        user: { username: string };
    }[];
}

interface Transaction {
    id: string;
    customerPlate: string | null;
    totalAmount: number;
    status: string;
    createdAt: string;
    branch: { name: string };
    details: TransactionDetail[];
}

const RETURN_REASONS = [
    { value: 'CUSTOMER_REQUEST', label: 'Permintaan Customer' },
    { value: 'DEFECTIVE', label: 'Barang Cacat / Rusak' },
    { value: 'WRONG_ITEM', label: 'Barang Salah' },
    { value: 'OTHER', label: 'Lainnya' },
];

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<TransactionDetail | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [returnForm, setReturnForm] = useState({
        qty: 1,
        reason: 'CUSTOMER_REQUEST',
        notes: '',
    });

    useEffect(() => {
        fetchTransaction();
    }, [params.id]);

    const fetchTransaction = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/transactions/${params.id}`);
            setTransaction(data);
        } catch (error) {
            console.error('Failed to fetch transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const openReturnModal = (detail: TransactionDetail) => {
        setSelectedDetail(detail);
        const totalReturned = detail.returns.reduce((sum, r) => sum + r.qty, 0);
        const maxQty = detail.qty - totalReturned;
        setReturnForm({ qty: Math.min(1, maxQty), reason: 'CUSTOMER_REQUEST', notes: '' });
        setError('');
        setShowReturnModal(true);
    };

    const handleReturnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDetail) return;

        setError('');
        setSaving(true);

        try {
            await api.post('/returns', {
                transactionDetailId: selectedDetail.id,
                qty: returnForm.qty,
                reason: returnForm.reason,
                notes: returnForm.notes || null,
            });
            setShowReturnModal(false);
            fetchTransaction();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal membuat retur');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Transaksi tidak ditemukan</p>
            </div>
        );
    }

    const getAvailableQtyForReturn = (detail: TransactionDetail) => {
        const totalReturned = detail.returns.reduce((sum, r) => sum + r.qty, 0);
        return detail.qty - totalReturned;
    };

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-3"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Detail Transaksi</h1>
                <p className="text-slate-500 text-sm mt-1">
                    {new Date(transaction.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="py-4">
                        <p className="text-xs text-slate-500 mb-1">ID Transaksi</p>
                        <p className="font-mono text-sm text-slate-700">{transaction.id.slice(0, 13)}...</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-xs text-slate-500 mb-1">Cabang</p>
                        <p className="font-medium text-slate-800">{transaction.branch.name}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-xs text-slate-500 mb-1">Plat Kendaraan</p>
                        <p className="font-medium text-slate-800">{transaction.customerPlate || '-'}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Items */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Item Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transaction.details.map((detail) => {
                            const availableForReturn = getAvailableQtyForReturn(detail);
                            const hasReturns = detail.returns.length > 0;

                            return (
                                <div key={detail.id} className="border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{detail.product.name}</h3>
                                            <p className="text-xs text-slate-400">{detail.product.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">
                                                {detail.qty} × {formatCurrency(detail.priceAtMoment)}
                                            </p>
                                            <p className="font-semibold text-slate-800">{formatCurrency(detail.subtotal)}</p>
                                        </div>
                                    </div>

                                    {detail.mechanic && (
                                        <div className="flex items-center justify-between py-2 px-3 bg-amber-50 rounded-lg mb-3">
                                            <p className="text-xs text-amber-700">Mekanik: {detail.mechanic.name}</p>
                                            <p className="text-sm font-medium text-amber-800">
                                                {formatCurrency(detail.mechanicFee || 0)}
                                            </p>
                                        </div>
                                    )}

                                    {/* Returns */}
                                    {hasReturns && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                            <p className="text-xs font-semibold text-red-800 mb-2">Riwayat Retur:</p>
                                            <div className="space-y-1.5">
                                                {detail.returns.map((ret) => (
                                                    <div key={ret.id} className="flex items-center justify-between text-xs">
                                                        <span className="text-red-600">
                                                            {ret.qty} item • {RETURN_REASONS.find(r => r.value === ret.reason)?.label}
                                                        </span>
                                                        <span className="text-red-500">
                                                            {new Date(ret.createdAt).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Return Button */}
                                    {availableForReturn > 0 && detail.product.type === 'GOODS' && transaction.status !== 'CANCELLED' && (
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => openReturnModal(detail)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Retur ({availableForReturn} tersedia)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-slate-900">Total</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(transaction.totalAmount)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Return Modal */}
            {showReturnModal && selectedDetail && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Retur Produk</h2>
                            <button onClick={() => setShowReturnModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                            <p className="font-medium text-slate-800">{selectedDetail.product.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Tersedia untuk retur: {getAvailableQtyForReturn(selectedDetail)} dari {selectedDetail.qty} item
                            </p>
                        </div>

                        <form onSubmit={handleReturnSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Jumlah Retur</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={getAvailableQtyForReturn(selectedDetail)}
                                    value={returnForm.qty}
                                    onChange={(e) => setReturnForm({ ...returnForm, qty: parseInt(e.target.value) || 1 })}
                                    required
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Alasan Retur</label>
                                <select
                                    value={returnForm.reason}
                                    onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                >
                                    {RETURN_REASONS.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan (opsional)</label>
                                <textarea
                                    value={returnForm.notes}
                                    onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                    placeholder="Keterangan tambahan..."
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-3">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowReturnModal(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1" disabled={saving}>
                                    {saving ? 'Memproses...' : 'Retur'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
