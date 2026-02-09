'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mechanicsApi } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mekanik</h1>
                    <p className="text-gray-500">Kelola data master mekanik</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Mekanik
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        Nama
                                    </th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        Cabang
                                    </th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        Telepon
                                    </th>
                                    <th className="text-center py-3 text-sm font-medium text-gray-500">
                                        Status
                                    </th>
                                    <th className="text-center py-3 text-sm font-medium text-gray-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {mechanics.map((mechanic) => (
                                    <tr key={mechanic.id} className="border-b">
                                        <td className="py-3 font-medium">{mechanic.name}</td>
                                        <td className="py-3 text-gray-500">
                                            {mechanic.branch?.name || '-'}
                                        </td>
                                        <td className="py-3 text-gray-500">
                                            {mechanic.phone || '-'}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${mechanic.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {mechanic.isActive ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded">
                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(mechanic.id)}
                                                    className="p-2 hover:bg-gray-100 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
