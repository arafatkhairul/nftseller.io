import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Blockchains',
        href: '/admin/blockchains',
    },
];

interface Blockchain {
    id: number;
    name: string;
    logo: string | null;
    exchange_rate: number;
    nfts_count: number;
}

interface ErrorMessages {
    [key: string]: string | string[];
}

export default function AdminBlockchains({ blockchains }: { blockchains: Blockchain[] }) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<ErrorMessages>({});
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: null as File | null,
        exchange_rate: '0',
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrors({});

        const form = new FormData();
        form.append('name', formData.name);
        form.append('exchange_rate', formData.exchange_rate);
        if (formData.logo) {
            form.append('logo', formData.logo);
        }

        if (editingId) {
            router.post(`/admin/blockchains/${editingId}`, form, {
                onSuccess: () => {
                    setShowDialog(false);
                    resetForm();
                },
                onError: (errors) => {
                    setErrors(errors as ErrorMessages);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        } else {
            router.post('/admin/blockchains', form, {
                onSuccess: () => {
                    setShowDialog(false);
                    resetForm();
                },
                onError: (errors) => {
                    setErrors(errors as ErrorMessages);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', logo: null, exchange_rate: '0' });
        setLogoPreview(null);
        setEditingId(null);
        setErrors({});
    };

    const handleEdit = (blockchain: Blockchain) => {
        setFormData({
            name: blockchain.name,
            logo: null,
            exchange_rate: String(blockchain.exchange_rate),
        });
        setLogoPreview(blockchain.logo);
        setEditingId(blockchain.id);
        setShowDialog(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this blockchain?')) {
            router.delete(`/admin/blockchains/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blockchain Management" />
            <div className="dash-view">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Blockchain Management</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Manage blockchain networks for your NFT marketplace
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowDialog(true);
                        }}
                        className="flex items-center gap-2"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Blockchain
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Blockchains</CardTitle>
                        <CardDescription>Total of {blockchains.length} blockchains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {blockchains.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No blockchains yet. Add your first blockchain!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-left text-sm font-medium text-muted-foreground">
                                            <th className="pb-3 px-2">Logo</th>
                                            <th className="pb-3 px-2">Name</th>
                                            <th className="pb-3 px-2">Exchange Rate (USD)</th>
                                            <th className="pb-3 px-2">NFTs Count</th>
                                            <th className="pb-3 px-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blockchains.map((blockchain) => (
                                            <tr key={blockchain.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="py-4 px-2">
                                                    {blockchain.logo ? (
                                                        <img
                                                            src={blockchain.logo}
                                                            alt={blockchain.name}
                                                            className="w-10 h-10 rounded-lg object-contain bg-muted p-1"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                                                            {blockchain.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-2 font-medium">{blockchain.name}</td>
                                                <td className="py-4 px-2">${Number(blockchain.exchange_rate).toLocaleString()}</td>
                                                <td className="py-4 px-2 text-muted-foreground">{blockchain.nfts_count}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(blockchain)}
                                                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(blockchain.id)}
                                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Blockchain' : 'Add New Blockchain'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Blockchain Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Ethereum, Polygon, Solana"
                                className="mt-1"
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="exchange_rate">Exchange Rate (1 Unit to USD)</Label>
                            <Input
                                id="exchange_rate"
                                type="number"
                                step="0.01"
                                value={formData.exchange_rate}
                                onChange={(e) => setFormData({ ...formData, exchange_rate: e.target.value })}
                                placeholder="e.g., 2000.00"
                                className="mt-1"
                                required
                            />
                            {errors.exchange_rate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {Array.isArray(errors.exchange_rate) ? errors.exchange_rate[0] : errors.exchange_rate}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="logo">Logo</Label>
                            {logoPreview && (
                                <div className="mt-2 mb-3">
                                    <img
                                        src={logoPreview}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-lg object-contain bg-muted p-2 border"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {editingId && !formData.logo ? 'Current logo' : 'New logo preview'}
                                    </p>
                                </div>
                            )}
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="mt-1"
                            />
                            {errors.logo && (
                                <p className="text-red-500 text-sm mt-1">
                                    {Array.isArray(errors.logo) ? errors.logo[0] : errors.logo}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={isProcessing} className="flex-1">
                                {isProcessing ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowDialog(false);
                                    resetForm();
                                }}
                                disabled={isProcessing}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
