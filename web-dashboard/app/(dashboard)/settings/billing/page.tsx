'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
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

    // Mock subscription data
    const subscription = {
        status: 'TRIAL', // TRIAL, ACTIVE, EXPIRED
        plan: null,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    };

    const handleUpgrade = async () => {
        setLoading(true);
        // TODO: Integrate with Xendit
        alert(`Redirect ke pembayaran ${billing === 'monthly' ? 'bulanan' : 'tahunan'}...`);
        setLoading(false);
    };

    const daysLeft = Math.ceil(
        (subscription.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
                <p className="text-gray-500">Kelola langganan Ring Pro Anda</p>
            </div>

            {/* Current Status */}
            <Card className="mb-8 border-l-4 border-l-orange-500">
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Status Langganan</p>
                        <p className="text-lg font-semibold">
                            {subscription.status === 'TRIAL' && (
                                <span className="text-orange-600">
                                    🎁 Trial - {daysLeft} hari tersisa
                                </span>
                            )}
                            {subscription.status === 'ACTIVE' && (
                                <span className="text-green-600">✅ Aktif</span>
                            )}
                            {subscription.status === 'EXPIRED' && (
                                <span className="text-red-600">❌ Expired</span>
                            )}
                        </p>
                    </div>
                    {subscription.status === 'ACTIVE' && (
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Berlaku sampai</p>
                            <p className="font-medium">
                                {subscription.expiresAt.toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pricing Toggle */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${billing === 'monthly'
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500'
                            }`}
                    >
                        Bulanan
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${billing === 'yearly'
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500'
                            }`}
                    >
                        Tahunan
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Hemat 16%
                        </span>
                    </button>
                </div>
            </div>

            {/* Pricing Card */}
            <div className="max-w-lg mx-auto">
                <Card className="border-2 border-blue-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                        <Crown className="w-3 h-3 inline mr-1" />
                        RING PRO
                    </div>
                    <CardContent className="pt-8">
                        <div className="text-center mb-6">
                            <p className="text-4xl font-bold text-gray-900">
                                {formatCurrency(PLANS[billing].price)}
                            </p>
                            <p className="text-gray-500">{PLANS[billing].period}</p>
                            {billing === 'yearly' && (
                                <p className="text-sm text-green-600 mt-1">
                                    Hemat {formatCurrency(PLANS.yearly.save)} per tahun
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 mb-6">
                            {FEATURES.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
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

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Pembayaran aman via Virtual Account, QRIS, atau E-Wallet
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ */}
            <div className="max-w-lg mx-auto mt-12">
                <h2 className="text-lg font-semibold mb-4">FAQ</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Apakah ada trial gratis?</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Ya! Setiap akun baru mendapat 14 hari trial gratis dengan fitur lengkap.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Bagaimana cara bayar?</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Anda bisa bayar via Transfer Bank, Virtual Account, QRIS, atau E-Wallet (OVO, GoPay, Dana).
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Bisa cancel kapan saja?</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Ya, tidak ada kontrak. Langganan akan berakhir di akhir periode.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
