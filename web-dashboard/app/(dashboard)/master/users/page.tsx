'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface User {
    id: string;
    username: string;
    role: string;
    isActive: boolean;
    branch: { name: string } | null;
    createdAt: string;
}

interface Branch {
    id: string;
    name: string;
}

const ROLES = [
    { value: 'MANAGER', label: 'Manager', desc: 'Akses laporan & manajemen' },
    { value: 'CASHIER', label: 'Kasir', desc: 'Input transaksi & scan barcode' },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    // Form state
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'CASHIER',
        branchId: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, branchesRes] = await Promise.all([
                api.get('/users'),
                api.get('/branches'),
            ]);
            setUsers(usersRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditUser(null);
        setForm({ username: '', password: '', role: 'CASHIER', branchId: '' });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setForm({
            username: user.username,
            password: '',
            role: user.role,
            branchId: user.branch?.name || '',
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (editUser) {
                // Update user
                await api.patch(`/users/${editUser.id}`, {
                    username: form.username,
                    role: form.role,
                    branchId: form.branchId || null,
                    ...(form.password && { password: form.password }),
                });
            } else {
                // Create user
                await api.post('/users', {
                    username: form.username,
                    password: form.password,
                    role: form.role,
                    branchId: form.branchId || null,
                });
            }
            setShowModal(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin hapus user ini?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchData();
        } catch (error) {
            alert('Gagal menghapus user');
        }
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            OWNER: 'bg-purple-100 text-purple-700',
            MANAGER: 'bg-blue-100 text-blue-700',
            CASHIER: 'bg-green-100 text-green-700',
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Karyawan</h1>
                    <p className="text-gray-500">Kelola akun karyawan Anda</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Karyawan
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
                                        Username
                                    </th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        Role
                                    </th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                                        Cabang
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
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            Belum ada karyawan. Klik "Tambah Karyawan" untuk menambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b">
                                            <td className="py-3 font-medium">{user.username}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-500">
                                                {user.branch?.name || 'Semua Cabang'}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${user.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {user.isActive ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 hover:bg-gray-100 rounded"
                                                    >
                                                        <Pencil className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    {user.role !== 'OWNER' && (
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-2 hover:bg-gray-100 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    )}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                {editUser ? 'Edit Karyawan' : 'Tambah Karyawan'}
                            </h2>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Username"
                                placeholder="Contoh: kasir_budi"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />

                            <Input
                                type="password"
                                label={editUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                                placeholder="Min. 6 karakter"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required={!editUser}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <div className="space-y-2">
                                    {ROLES.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${form.role === role.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={form.role === role.value}
                                                onChange={(e) =>
                                                    setForm({ ...form, role: e.target.value })
                                                }
                                                className="mr-3"
                                            />
                                            <div>
                                                <p className="font-medium">{role.label}</p>
                                                <p className="text-sm text-gray-500">{role.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cabang (opsional)
                                </label>
                                <select
                                    value={form.branchId}
                                    onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">Semua Cabang</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setShowModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1" disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
