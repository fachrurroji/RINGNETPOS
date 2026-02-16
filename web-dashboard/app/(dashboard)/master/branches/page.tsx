'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { branchesApi } from '@/lib/api';
import { Plus, Pencil, Trash2, MapPin, Phone } from 'lucide-react';

interface Branch {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    isActive: boolean;
}

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const { data } = await branchesApi.getAll();
            setBranches(data);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin hapus cabang ini?')) return;
        try {
            await branchesApi.delete(id);
            fetchBranches();
        } catch (error) {
            alert('Gagal menghapus cabang');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Cabang</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola daftar cabang bengkel</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Cabang
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : branches.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center py-16">
                        <div className="p-4 bg-slate-100 rounded-2xl mb-4">
                            <MapPin className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-base font-medium text-slate-800">Belum ada cabang</h3>
                        <p className="text-sm text-slate-500 mt-1">Klik &quot;Tambah Cabang&quot; untuk menambahkan cabang pertama.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {branches.map((branch) => (
                        <Card key={branch.id} className="hover:border-slate-300">
                            <CardContent>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900">{branch.name}</h3>
                                    </div>
                                    <span className={`ml-3 px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${branch.isActive
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                                        }`}>
                                        {branch.isActive ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{branch.address || 'Alamat belum diisi'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{branch.phone || '-'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                        <Pencil className="w-4 h-4 text-slate-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(branch.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
