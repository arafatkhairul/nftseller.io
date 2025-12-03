import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        setIsCreateOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            is_active: category.is_active,
        });
        setIsCreateOpen(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => setIsCreateOpen(false),
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => setIsCreateOpen(false),
            });
        }
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    const toggleStatus = (category: Category) => {
        router.put(`/admin/categories/${category.id}`, {
            ...category,
            is_active: !category.is_active,
        });
    };

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData(data => ({
            ...data,
            name: name,
            slug: editingCategory ? data.slug : name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin Dashboard', href: '/admin/dashboard' },
            { title: 'Categories', href: '/admin/categories' }
        ]}>
            <Head title="Categories" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground mt-1">Manage NFT categories.</p>
                    </div>
                    <Button onClick={openCreateModal} className="gap-2">
                        <FaPlus className="w-4 h-4" />
                        Add New Category
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                        <CardDescription>List of all available NFT categories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Slug</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{category.name}</td>
                                            <td className="p-4 text-muted-foreground">{category.slug}</td>
                                            <td className="p-4 text-muted-foreground max-w-xs truncate">{category.description}</td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={category.is_active}
                                                        onChange={() => toggleStatus(category)}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-muted-foreground">{category.is_active ? 'Active' : 'Inactive'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                                                        <FaPencilAlt className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteCategory(category.id)}>
                                                        <FaTrash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                No categories found. Add one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                            <DialogDescription>
                                Create a new category for NFTs.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Art"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. art"
                                    required
                                />
                                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Category description"
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>
                                    {editingCategory ? 'Update Category' : 'Add Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
