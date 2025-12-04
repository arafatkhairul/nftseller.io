import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface P2pNetwork {
    id: number;
    name: string;
    currency_symbol: string;
    is_active: boolean;
}

interface ErrorMessages {
    [key: string]: string;
}

export default function AdminP2pNetworks({ networks }: { networks: P2pNetwork[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        currency_symbol: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<ErrorMessages>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredNetworks = networks.filter(network =>
        network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.currency_symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        if (editingId) {
            router.put(`/admin/p2p-networks/${editingId}`, formData, {
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
            router.post('/admin/p2p-networks', formData, {
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

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this network?')) {
            router.delete(`/admin/p2p-networks/${id}`);
        }
    };

    const handleEdit = (network: P2pNetwork) => {
        setFormData({
            name: network.name,
            currency_symbol: network.currency_symbol,
            is_active: network.is_active,
        });
        setEditingId(network.id);
        setShowDialog(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            currency_symbol: '',
            is_active: true,
        });
        setEditingId(null);
        setErrors({});
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'P2P Networks', href: '/admin/p2p-networks' },
        ]}>
            <Head title="Manage P2P Networks" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">P2P Networks</h1>
                        <p className="text-muted-foreground">
                            Manage transfer networks and currencies for P2P transactions.
                        </p>
                    </div>
                    <Dialog open={showDialog} onOpenChange={(open) => {
                        setShowDialog(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Network
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? 'Edit Network' : 'Add New Network'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Network Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Ethereum (ERC20)"
                                        className="mt-1"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="currency_symbol">Currency Symbol *</Label>
                                    <Input
                                        id="currency_symbol"
                                        value={formData.currency_symbol}
                                        onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                                        placeholder="e.g. ETH"
                                        className="mt-1"
                                    />
                                    {errors.currency_symbol && <p className="text-red-500 text-sm mt-1">{errors.currency_symbol}</p>}
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label>Active Status</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable or disable this network
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isProcessing}>
                                        {isProcessing ? 'Saving...' : (editingId ? 'Update Network' : 'Create Network')}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search networks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9"
                    />
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNetworks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No networks found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNetworks.map((network) => (
                                    <TableRow key={network.id}>
                                        <TableCell className="font-medium">{network.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{network.currency_symbol}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={network.is_active ? 'default' : 'secondary'}>
                                                {network.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(network)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(network.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
