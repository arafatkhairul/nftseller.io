import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'NFTs',
        href: '/admin/nfts',
    },
];

interface NFT {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
    blockchain: string;
    contract_address: string;
    token_id: string;
    status: string;
    creator: string;
    created_at: string;
}

interface ErrorMessages {
    [key: string]: string | string[];
}

export default function AdminNfts({ nfts }: { nfts: NFT[] }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<ErrorMessages>({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null as File | null,
        price: '',
        blockchain: 'Ethereum',
        contract_address: '',
        token_id: '',
        status: 'active',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrors({});

        // Validate required fields on client side first
        const newErrors: ErrorMessages = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.price) {
            newErrors.price = 'Price is required';
        }
        if (!formData.blockchain) {
            newErrors.blockchain = 'Blockchain is required';
        }
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }
        if (!editingId && !formData.image) {
            newErrors.image = 'Image is required for new NFTs';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsProcessing(false);
            return;
        }

        // Create FormData for multipart/form-data submission
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        if (formData.image) {
            form.append('image', formData.image);
        }
        form.append('price', formData.price);
        form.append('blockchain', formData.blockchain);
        form.append('contract_address', formData.contract_address);
        form.append('token_id', formData.token_id);
        form.append('status', formData.status);

        if (editingId) {
            // For PUT requests with FormData, we need to use POST with _method override
            form.append('_method', 'PUT');

            router.post(`/admin/nfts/${editingId}`, form, {
                onSuccess: () => {
                    setShowForm(false);
                    setFormData({
                        name: '',
                        description: '',
                        image: null,
                        price: '',
                        blockchain: 'Ethereum',
                        contract_address: '',
                        token_id: '',
                        status: 'active',
                    });
                    setImagePreview(null);
                    setEditingId(null);
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors as ErrorMessages);
                    console.error('Validation errors:', errors);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        } else {
            // Use router.post() for creation - Inertia automatically handles CSRF
            router.post('/admin/nfts', form, {
                onSuccess: () => {
                    setShowForm(false);
                    setFormData({
                        name: '',
                        description: '',
                        image: null,
                        price: '',
                        blockchain: 'Ethereum',
                        contract_address: '',
                        token_id: '',
                        status: 'active',
                    });
                    setImagePreview(null);
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors as ErrorMessages);
                    console.error('Validation errors:', errors);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({
            name: '',
            description: '',
            image: null,
            price: '',
            blockchain: 'Ethereum',
            contract_address: '',
            token_id: '',
            status: 'active',
        });
        setImagePreview(null);
        setEditingId(null);
    };

    const handleEditNft = (nft: NFT) => {
        setFormData({
            name: nft.name,
            description: nft.description,
            image: null,
            price: nft.price.toString(),
            blockchain: nft.blockchain,
            contract_address: nft.contract_address || '',
            token_id: nft.token_id || '',
            status: nft.status,
        });
        // Show existing image preview when editing
        if (nft.image_url) {
            setImagePreview(nft.image_url);
        }
        setEditingId(nft.id);
        setShowForm(true);
    };

    const handleDeleteNft = (nftId: number) => {
        if (confirm('Are you sure you want to delete this NFT?')) {
            router.delete(`/admin/nfts/${nftId}`, {
                onSuccess: () => {
                    // Page will automatically reload via Inertia
                },
                onError: () => {
                    alert('Error deleting NFT. Please try again.');
                },
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-500';
            case 'inactive':
                return 'bg-gray-500/10 text-gray-500';
            case 'sold':
                return 'bg-blue-500/10 text-blue-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="NFT Management" />
            <div className="dash-view">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">NFT Management</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Create and manage NFTs in your marketplace
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (showForm) {
                                handleCancel();
                            } else {
                                setShowForm(true);
                                setEditingId(null);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add NFT
                    </button>
                </div>

                {showForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit NFT' : 'Add New NFT'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">NFT Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Digital Art #1"
                                            className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                errors.name ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Price (ETH)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0.00"
                                            className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                errors.price ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.price && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {Array.isArray(errors.price) ? errors.price[0] : errors.price}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your NFT..."
                                        rows={3}
                                        className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                            errors.description ? 'border-red-500' : ''
                                        }`}
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.description)
                                                ? errors.description[0]
                                                : errors.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium">NFT Image</label>
                                    <div className="mt-1 space-y-4">
                                        {imagePreview && (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full max-h-48 rounded-lg object-cover border border-border"
                                                />
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    {editingId && !formData.image ? 'Current image' : 'New image preview'}
                                                </p>
                                            </div>
                                        )}
                                        <label
                                            className={`w-full flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                                errors.image
                                                    ? 'border-red-500 bg-red-500/5'
                                                    : 'border-primary/30 hover:border-primary/50 bg-primary/5'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <svg className="mx-auto h-8 w-8 text-primary" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-8 8m0 0l-8-8m8 8v20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {formData.image ? (formData.image as any).name : 'Click to upload image'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP up to 5MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                required={!editingId}
                                            />
                                        </label>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm">
                                                {Array.isArray(errors.image) ? errors.image[0] : errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Blockchain</label>
                                        <select
                                            value={formData.blockchain}
                                            onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="Ethereum">Ethereum</option>
                                            <option value="Polygon">Polygon</option>
                                            <option value="Solana">Solana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Saving...' : (editingId ? 'Update NFT' : 'Create NFT')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isProcessing}
                                        className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>All NFTs</CardTitle>
                        <CardDescription>Total of {nfts.length} NFTs in your marketplace</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {nfts.length === 0 ? (
                            <div className="text-center py-8">
                                <FaImage className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No NFTs yet. Create your first NFT!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-left text-sm font-medium text-muted-foreground">
                                            <th className="pb-3 px-2">Name</th>
                                            <th className="pb-3 px-2">Image</th>
                                            <th className="pb-3 px-2">Price</th>
                                            <th className="pb-3 px-2">Creator</th>
                                            <th className="pb-3 px-2">Status</th>
                                            <th className="pb-3 px-2">Date</th>
                                            <th className="pb-3 px-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nfts.map((nft) => (
                                            <tr key={nft.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="py-4 px-2 font-medium">{nft.name}</td>
                                                <td className="py-4 px-2">
                                                    <img
                                                        src={nft.image_url}
                                                        alt={nft.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                </td>
                                                <td className="py-4 px-2 font-semibold text-green-500">{nft.price} ETH</td>
                                                <td className="py-4 px-2 text-sm text-muted-foreground">{nft.creator}</td>
                                                <td className="py-4 px-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nft.status)}`}>
                                                        {nft.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-sm text-muted-foreground">{nft.created_at}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditNft(nft)}
                                                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNft(nft.id)}
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
        </AppLayout>
    );
}
