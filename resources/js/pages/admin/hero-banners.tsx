import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaCheck, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Hero Banners',
        href: '/admin/hero-banners',
    },
];

interface HeroBanner {
    id: number;
    title: string;
    creator: string;
    is_verified: boolean;
    background_image: string | null;
    floor_price: number;
    items: number;
    total_volume: number;
    listed_percentage: number;
    featured_nfts: Array<{ id: string; image: string; name: string }>;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

interface ErrorMessages {
    [key: string]: string | string[];
}

export default function AdminHeroBanners({ banners }: { banners: HeroBanner[] }) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<ErrorMessages>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        creator: '',
        is_verified: false,
        background_image: null as File | null,
        floor_price: '',
        items: '',
        total_volume: '',
        listed_percentage: '',
        display_order: '',
        is_active: true,
    });
    const [featuredNftPreviews, setFeaturedNftPreviews] = useState<{ [key: string]: string }>({});

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, background_image: file });
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

        const form = new FormData();
        form.append('title', formData.title);
        form.append('creator', formData.creator);
        form.append('is_verified', formData.is_verified ? '1' : '0');
        if (formData.background_image) {
            form.append('background_image', formData.background_image);
        }
        form.append('floor_price', formData.floor_price);
        form.append('items', formData.items);
        form.append('total_volume', formData.total_volume);
        form.append('listed_percentage', formData.listed_percentage);
        form.append('display_order', formData.display_order);
        form.append('is_active', formData.is_active ? '1' : '0');

        if (editingId) {
            // form.append('_method', 'PUT'); // Removed because route is POST for file uploads
            router.post(`/admin/hero-banners/${editingId}`, form, {
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
            router.post('/admin/hero-banners', form, {
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
        setFormData({
            title: '',
            creator: '',
            is_verified: false,
            background_image: null,
            floor_price: '',
            items: '',
            total_volume: '',
            listed_percentage: '',
            display_order: '',
            is_active: true,
        });
        setImagePreview(null);
        setEditingId(null);
        setErrors({});
    };

    const handleEdit = (banner: HeroBanner) => {
        setFormData({
            title: banner.title,
            creator: banner.creator,
            is_verified: banner.is_verified,
            background_image: null,
            floor_price: banner.floor_price.toString(),
            items: banner.items.toString(),
            total_volume: banner.total_volume.toString(),
            listed_percentage: banner.listed_percentage.toString(),
            display_order: banner.display_order.toString(),
            is_active: banner.is_active,
        });
        setImagePreview(banner.background_image);
        setEditingId(banner.id);
        setShowDialog(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this hero banner?')) {
            router.delete(`/admin/hero-banners/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hero Banner Management" />
            <div className="dash-view">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Hero Banner Management</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Manage hero banners displayed on the homepage
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
                        Add Hero Banner
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Hero Banners</CardTitle>
                        <CardDescription>Total of {banners.length} hero banners</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {banners.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No hero banners yet. Add your first banner!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-left text-sm font-medium text-muted-foreground">
                                            <th className="pb-3 px-2">Preview</th>
                                            <th className="pb-3 px-2">Title</th>
                                            <th className="pb-3 px-2">Creator</th>
                                            <th className="pb-3 px-2">Floor Price</th>
                                            <th className="pb-3 px-2">Order</th>
                                            <th className="pb-3 px-2">Status</th>
                                            <th className="pb-3 px-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {banners.map((banner) => (
                                            <tr key={banner.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="py-4 px-2">
                                                    {banner.background_image ? (
                                                        <img
                                                            src={banner.background_image}
                                                            alt={banner.title}
                                                            className="w-20 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-12 rounded-lg bg-muted flex items-center justify-center text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{banner.title}</span>
                                                        {banner.is_verified && (
                                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                                <FaCheck className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-muted-foreground">{banner.creator}</td>
                                                <td className="py-4 px-2 font-medium">{banner.floor_price} ETH</td>
                                                <td className="py-4 px-2 text-muted-foreground">{banner.display_order}</td>
                                                <td className="py-4 px-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${banner.is_active
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : 'bg-gray-500/10 text-gray-500'
                                                            }`}
                                                    >
                                                        {banner.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(banner)}
                                                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(banner.id)}
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Hero Banner' : 'Add New Hero Banner'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Basic Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Collection Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Good Vibes Club"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.title) ? errors.title[0] : errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="creator">Creator Name *</Label>
                                    <Input
                                        id="creator"
                                        value={formData.creator}
                                        onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                                        placeholder="e.g., GVC_Official"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.creator && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.creator) ? errors.creator[0] : errors.creator}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_verified"
                                    checked={formData.is_verified}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
                                />
                                <Label htmlFor="is_verified" className="cursor-pointer">Verified Creator</Label>
                            </div>

                            <div>
                                <Label htmlFor="background_image">Background Image *</Label>
                                {imagePreview && (
                                    <div className="mt-2 mb-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-32 rounded-lg object-cover border"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {editingId && !formData.background_image ? 'Current image' : 'New image preview'}
                                        </p>
                                    </div>
                                )}
                                <Input
                                    id="background_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1"
                                    required={!editingId}
                                />
                                {errors.background_image && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {Array.isArray(errors.background_image) ? errors.background_image[0] : errors.background_image}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Collection Statistics</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="floor_price">Floor Price (ETH) *</Label>
                                    <Input
                                        id="floor_price"
                                        type="number"
                                        step="0.001"
                                        value={formData.floor_price}
                                        onChange={(e) => setFormData({ ...formData, floor_price: e.target.value })}
                                        placeholder="0.592"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.floor_price && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.floor_price) ? errors.floor_price[0] : errors.floor_price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="items">Total Items *</Label>
                                    <Input
                                        id="items"
                                        type="number"
                                        value={formData.items}
                                        onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                                        placeholder="6968"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.items && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.items) ? errors.items[0] : errors.items}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="total_volume">Total Volume (ETH) *</Label>
                                    <Input
                                        id="total_volume"
                                        type="number"
                                        step="0.01"
                                        value={formData.total_volume}
                                        onChange={(e) => setFormData({ ...formData, total_volume: e.target.value })}
                                        placeholder="8975.61"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.total_volume && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.total_volume) ? errors.total_volume[0] : errors.total_volume}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="listed_percentage">Listed Percentage *</Label>
                                    <Input
                                        id="listed_percentage"
                                        type="number"
                                        step="0.1"
                                        value={formData.listed_percentage}
                                        onChange={(e) => setFormData({ ...formData, listed_percentage: e.target.value })}
                                        placeholder="9.5"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.listed_percentage && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {Array.isArray(errors.listed_percentage) ? errors.listed_percentage[0] : errors.listed_percentage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Display Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Display Settings</h3>

                            <div>
                                <Label htmlFor="display_order">Display Order *</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                                    placeholder="0"
                                    className="mt-1"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                                {errors.display_order && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {Array.isArray(errors.display_order) ? errors.display_order[0] : errors.display_order}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">Active (Show on homepage)</Label>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={isProcessing} className="flex-1">
                                {isProcessing ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
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
