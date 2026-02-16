'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const PLANS = {
    monthly: { price: 99000, label: 'Bulanan', period: '/bulan' },
    yearly: { price: 999000, label: 'Tahunan', period: '/tahun', save: 189000 },
};

const FEATURES = [
    'Unlimited cabang',
    'Unlimited transaksi',
    'Unlimited mekanik',
    'Laporan komisi lengkap',
    'Riwayat kendaraan',
    'Export laporan Excel',
    'Support prioritas',
];

export default function BillingPage() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(false);

    const subscription = {
        status: 'TRIAL',
        plan: null,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    };

    const handleUpgrade = async () => {
        setLoading(true);
        alert(`Redirect ke pembayaran ${billing === 'monthly' ? 'bulanan' : 'tahunan'}...`);
        setLoading(false);
    };

    const daysLeft = Math.ceil(
        (subscription.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola langganan Ring Pro Anda</p>
            </div>

            {/* Current Status */}
            <Card className="mb-8 border-l-4 border-l-amber-500">
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Status Langganan</p>
                        <p className="text-base font-semibold">
                            {subscription.status === 'TRIAL' && (
                                <span className="text-amber-600">🎁 Trial — {daysLeft} hari tersisa</span>
                            )}
                            {subscription.status === 'ACTIVE' && (
                                <span className="text-emerald-600">✅ Aktif</span>
                            )}
                            {subscription.status === 'EXPIRED' && (
                                <span className="text-red-600">❌ Expired</span>
                            )}
                        </p>
                    </div>
                    {subscription.status === 'ACTIVE' && (
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Berlaku sampai</p>
                            <p className="font-medium text-sm">{subscription.expiresAt.toLocaleDateString('id-ID')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Toggle */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-slate-100 rounded-xl p-1">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${billing === 'monthly'
                            ? 'bg-white shadow-sm text-slate-900'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Bulanan
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billing === 'yearly'
                            ? 'bg-white shadow-sm text-slate-900'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Tahunan
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            -16%
                        </span>
                    </button>
                </div>
            </div>

            {/* Pricing Card */}
            <div className="max-w-lg mx-auto">
                <Card className="border-2 border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                        <Crown className="w-3 h-3" />
                        RING PRO
                    </div>
                    <CardContent className="pt-10 pb-8">
                        <div className="text-center mb-8">
                            <p className="text-4xl font-extrabold text-slate-900">
                                {formatCurrency(PLANS[billing].price)}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">{PLANS[billing].period}</p>
                            {billing === 'yearly' && (
                                <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center justify-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    Hemat {formatCurrency(PLANS.yearly.save)} per tahun
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 mb-8">
                            {FEATURES.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? 'Loading...' : 'Berlangganan Sekarang'}
                        </Button>

                        <p className="text-xs text-slate-400 text-center mt-4">
                            Pembayaran aman via Virtual Account, QRIS, atau E-Wallet
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ */}
            <div className="max-w-lg mx-auto mt-12">
                <h2 className="text-base font-bold text-slate-900 mb-4">Pertanyaan Umum</h2>
                <div className="space-y-3">
                    {[
                        { q: 'Apakah ada trial gratis?', a: 'Ya! Setiap akun baru mendapat 14 hari trial gratis dengan fitur lengkap.' },
                        { q: 'Bagaimana cara bayar?', a: 'Anda bisa bayar via Transfer Bank, Virtual Account, QRIS, atau E-Wallet (OVO, GoPay, Dana).' },
                        { q: 'Bisa cancel kapan saja?', a: 'Ya, tidak ada kontrak. Langganan akan berakhir di akhir periode.' },
                    ].map((faq, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">{faq.q}</p>
                            <p className="text-sm text-slate-600 mt-1.5">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
