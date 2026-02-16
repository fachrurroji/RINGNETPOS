'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

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
    { value: 'WAREHOUSE', label: 'Gudang', desc: 'Kelola stok & transfer barang' },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');

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
                await api.patch(`/users/${editUser.id}`, {
                    username: form.username,
                    role: form.role,
                    branchId: form.branchId || null,
                    ...(form.password && { password: form.password }),
                });
            } else {
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
        const styles: Record<string, string> = {
            OWNER: 'bg-purple-50 text-purple-700 border border-purple-200',
            MANAGER: 'bg-blue-50 text-blue-700 border border-blue-200',
            CASHIER: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            WAREHOUSE: 'bg-teal-50 text-teal-700 border border-teal-200',
        };
        return styles[role] || 'bg-slate-50 text-slate-600 border border-slate-200';
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Karyawan</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola akun karyawan Anda</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Karyawan
                </Button>
            </div>

            {/* Search */}
            <div className="mb-5 relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari karyawan..."
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
                                    <th className="text-left">Username</th>
                                    <th className="text-left">Role</th>
                                    <th className="text-left">Cabang</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            Belum ada karyawan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="font-medium text-slate-800">{user.username}</td>
                                            <td>
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="text-slate-500">
                                                {user.branch?.name || 'Semua Cabang'}
                                            </td>
                                            <td className="text-center">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                                                    }`}>
                                                    {user.isActive ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4 text-slate-400" />
                                                    </button>
                                                    {user.role !== 'OWNER' && (
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-400" />
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editUser ? 'Edit Karyawan' : 'Tambah Karyawan'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5 text-slate-400" />
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
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                                <div className="space-y-2">
                                    {ROLES.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${form.role === role.value
                                                ? 'border-blue-500 bg-blue-50/50'
                                                : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={form.role === role.value}
                                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                className="mr-3 accent-blue-600"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{role.label}</p>
                                                <p className="text-xs text-slate-500">{role.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cabang (opsional)</label>
                                <select
                                    value={form.branchId}
                                    onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                >
                                    <option value="">Semua Cabang</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-3">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
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
