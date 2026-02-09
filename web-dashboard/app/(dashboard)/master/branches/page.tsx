'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { branchesApi } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cabang</h1>
                    <p className="text-gray-500">Kelola daftar cabang bengkel</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Cabang
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <Card key={branch.id}>
                            <CardContent>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{branch.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {branch.address || 'Alamat belum diisi'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {branch.phone || '-'}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${branch.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {branch.isActive ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(branch.id)}
                                        className="p-2 hover:bg-gray-100 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
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
