'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mechanicsApi } from '@/lib/api';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Mechanic {
    id: string;
    name: string;
    phone: string | null;
    isActive: boolean;
    branch: { name: string } | null;
}

export default function MechanicsPage() {
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMechanics();
    }, []);

    const fetchMechanics = async () => {
        setLoading(true);
        try {
            const { data } = await mechanicsApi.getAll();
            setMechanics(data);
        } catch (error) {
            console.error('Failed to fetch mechanics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin hapus mekanik ini?')) return;
        try {
            await mechanicsApi.delete(id);
            fetchMechanics();
        } catch (error) {
            alert('Gagal menghapus mekanik');
        }
    };

    const filtered = mechanics.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mekanik</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola data master mekanik</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Mekanik
                </Button>
            </div>

            <div className="mb-5 relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari mekanik..."
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
                                    <th className="text-left">Nama</th>
                                    <th className="text-left">Cabang</th>
                                    <th className="text-left">Telepon</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            {search ? 'Tidak ditemukan' : 'Belum ada mekanik'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((mechanic) => (
                                        <tr key={mechanic.id}>
                                            <td className="font-medium text-slate-800">{mechanic.name}</td>
                                            <td className="text-slate-500">{mechanic.branch?.name || '-'}</td>
                                            <td className="text-slate-500">{mechanic.phone || '-'}</td>
                                            <td className="text-center">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${mechanic.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                                                    }`}>
                                                    {mechanic.isActive ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex justify-center gap-1">
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                        <Pencil className="w-4 h-4 text-slate-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mechanic.id)}
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
