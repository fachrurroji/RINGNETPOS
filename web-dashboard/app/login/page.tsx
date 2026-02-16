'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await authApi.login(username, password);
            login(data.access_token, data.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <Wrench className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white text-xl font-bold">Ring Pro</span>
                    </div>
                    <p className="text-slate-500 text-sm">Mechanic Edition</p>
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                        Kelola bengkel Anda
                        <br />
                        <span className="text-blue-400">lebih efisien.</span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                        Dashboard lengkap untuk monitoring transaksi, mengelola produk & jasa,
                        mekanik, dan laporan keuangan bengkel Anda.
                    </p>
                </div>

                <p className="text-slate-600 text-xs relative z-10">
                    © 2026 Ring Pro. All rights reserved.
                </p>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <Wrench className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-slate-900 text-xl font-bold">Ring Pro</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Selamat Datang</h1>
                        <p className="text-slate-500 text-sm">Masuk ke dashboard Ring Pro</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="text"
                            label="Username"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            label="Password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Masuk...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Masuk
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Demo credentials:</p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-mono">
                                owner_demo
                            </code>
                            <span className="text-slate-400 text-xs">/</span>
                            <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-mono">
                                Owner123!
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
