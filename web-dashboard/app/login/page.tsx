'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">🔧 Ring Pro</h1>
                    <p className="text-gray-500 mt-2">Mechanic Edition Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Test credentials:</p>
                    <code className="text-xs text-gray-700">
                        owner_demo / Owner123!
                    </code>
                </div>
            </div>
        </div>
    );
}
