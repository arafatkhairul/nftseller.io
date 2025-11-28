import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useState } from 'react';

interface PaymentMethod {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    logo_path: string | null;
    wallet_address: string | null;
    qr_code: string | null;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    paymentMethods: PaymentMethod[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Payment Methods',
        href: '/admin/payment-methods',
    },
];

export default function AdminPaymentMethods({ paymentMethods }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
        logo: null as File | null,
        wallet_address: '',
        is_active: true,
        sort_order: 0,
    });

    const handleAddNew = () => {
        setEditingId(null);
        setLogoPreview(null);
        setFormData({
            name: '',
            description: '',
            icon: '',
            logo: null,
            wallet_address: '',
            is_active: true,
            sort_order: 0,
        });
        setShowForm(true);
    };

    const handleEdit = (method: PaymentMethod) => {
        setEditingId(method.id);
        setLogoPreview(method.logo_path ? `/storage/${method.logo_path}` : null);
        setFormData({
            name: method.name,
            description: method.description || '',
            icon: method.icon || '',
            logo: null,
            wallet_address: method.wallet_address || '',
            is_active: method.is_active,
            sort_order: method.sort_order,
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('icon', formData.icon);
        formDataToSend.append('wallet_address', formData.wallet_address);
        formDataToSend.append('is_active', formData.is_active ? '1' : '0');
        formDataToSend.append('sort_order', String(formData.sort_order));

        if (formData.logo) {
            formDataToSend.append('logo', formData.logo);
        }

        if (editingId) {
            router.post(`/admin/payment-methods/${editingId}?_method=PUT`, formDataToSend, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingId(null);
                    setLogoPreview(null);
                },
            });
        } else {
            router.post('/admin/payment-methods', formDataToSend, {
                onSuccess: () => {
                    setShowForm(false);
                    setLogoPreview(null);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this payment method?')) {
            router.delete(`/admin/payment-methods/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Methods" />
            <div className="dash-view">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Payment Methods</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Manage payment methods available for customers
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="gap-2">
                        <FiPlus className="w-4 h-4" />
                        Add Payment Method
                    </Button>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-6 border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle>
                                {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full mt-1 px-3 py-2 border border-sidebar-border/50 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., Wallet Connect, MetaMask"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="w-full mt-1 px-3 py-2 border border-sidebar-border/50 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="Optional description"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Icon Name</label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) =>
                                            setFormData({ ...formData, icon: e.target.value })
                                        }
                                        className="w-full mt-1 px-3 py-2 border border-sidebar-border/50 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., FaWallet, FaCreditCard"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Logo Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setFormData({ ...formData, logo: file });
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    setLogoPreview(event.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full mt-1 px-3 py-2 border border-sidebar-border/50 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                    {logoPreview && (
                                        <div className="mt-2">
                                            <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Wallet Address</label>
                                    <textarea
                                        value={formData.wallet_address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, wallet_address: e.target.value })
                                        }
                                        className="w-full mt-1 px-3 py-2 border border-sidebar-border/50 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., 0x742d35Cc6634C0532925a3b844Bc5e8aF836eAb4"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Sort Order</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.sort_order}
                                            onChange={(e) =>
                                                setFormData({ ...formData, sort_order: parseInt(e.target.value) })
                                            }
                                            className="w-full mt-1 px-3 py-2 border border-sidebar-border/50 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, is_active: e.target.checked })
                                                }
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm font-medium">Active</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">
                                        {editingId ? 'Update' : 'Create'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Methods List */}
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Payment Methods ({paymentMethods.length})</CardTitle>
                        <CardDescription>
                            These payment methods will be available during checkout
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr className="text-left text-sm font-medium text-muted-foreground">
                                        <th className="pb-3 px-2">Name</th>
                                        <th className="pb-3 px-2">Description</th>
                                        <th className="pb-3 px-2">Icon</th>
                                        <th className="pb-3 px-2">Order</th>
                                        <th className="pb-3 px-2">Status</th>
                                        <th className="pb-3 px-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentMethods.length > 0 ? (
                                        paymentMethods.map((method) => (
                                            <tr key={method.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="py-4 px-2">
                                                    <span className="font-medium text-foreground">{method.name}</span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        {method.description || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <span className="text-sm font-mono text-muted-foreground">
                                                        {method.icon || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <span className="text-sm font-medium">{method.sort_order}</span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <Badge
                                                        className={
                                                            method.is_active
                                                                ? 'bg-green-500/10 text-green-700 border-green-200 border flex items-center gap-1 w-fit'
                                                                : 'bg-gray-500/10 text-gray-700 border-gray-200 border flex items-center gap-1 w-fit'
                                                        }
                                                    >
                                                        {method.is_active ? (
                                                            <>
                                                                <FiCheck className="w-3 h-3" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiX className="w-3 h-3" />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(method)}
                                                            className="gap-1"
                                                        >
                                                            <FiEdit2 className="w-4 h-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(method.id)}
                                                            className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                                No payment methods yet. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
