import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { FaDiscord, FaFacebook, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaPencilAlt, FaPlus, FaTelegram, FaTiktok, FaTrash, FaTwitter, FaYoutube } from 'react-icons/fa';

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    is_active: boolean;
}

interface Props {
    links: SocialLink[];
}

const iconOptions = [
    { value: 'FaFacebook', label: 'Facebook', icon: FaFacebook },
    { value: 'FaTwitter', label: 'Twitter', icon: FaTwitter },
    { value: 'FaInstagram', label: 'Instagram', icon: FaInstagram },
    { value: 'FaLinkedin', label: 'LinkedIn', icon: FaLinkedin },
    { value: 'FaYoutube', label: 'YouTube', icon: FaYoutube },
    { value: 'FaDiscord', label: 'Discord', icon: FaDiscord },
    { value: 'FaTelegram', label: 'Telegram', icon: FaTelegram },
    { value: 'FaTiktok', label: 'TikTok', icon: FaTiktok },
    { value: 'FaGithub', label: 'GitHub', icon: FaGithub },
    { value: 'FaGlobe', label: 'Website', icon: FaGlobe },
];

export default function SocialLinksSettings({ links }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        platform: '',
        url: '',
        icon: 'FaGlobe',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingLink(null);
        reset();
        setIsCreateOpen(true);
    };

    const openEditModal = (link: SocialLink) => {
        setEditingLink(link);
        setData({
            platform: link.platform,
            url: link.url,
            icon: link.icon,
            is_active: link.is_active,
        });
        setIsCreateOpen(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingLink) {
            put(`/admin/settings/social-links/${editingLink.id}`, {
                onSuccess: () => setIsCreateOpen(false),
            });
        } else {
            post('/admin/settings/social-links', {
                onSuccess: () => setIsCreateOpen(false),
            });
        }
    };

    const deleteLink = (id: number) => {
        if (confirm('Are you sure you want to delete this link?')) {
            router.delete(`/admin/settings/social-links/${id}`);
        }
    };

    const toggleStatus = (link: SocialLink) => {
        router.put(`/admin/settings/social-links/${link.id}`, {
            ...link,
            is_active: !link.is_active,
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin Dashboard', href: '/admin/dashboard' },
            { title: 'Settings', href: '/admin/settings' },
            { title: 'Social Links', href: '/admin/settings/social-links' }
        ]}>
            <Head title="Social Links Settings" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
                        <p className="text-muted-foreground mt-1">Manage social media links displayed in the footer.</p>
                    </div>
                    <Button onClick={openCreateModal} className="gap-2">
                        <FaPlus className="w-4 h-4" />
                        Add New Link
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Links</CardTitle>
                        <CardDescription>Drag and drop to reorder (coming soon).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-4">Platform</th>
                                        <th className="p-4">URL</th>
                                        <th className="p-4">Icon</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {links.map((link) => {
                                        const Icon = iconOptions.find(opt => opt.value === link.icon)?.icon || FaGlobe;
                                        return (
                                            <tr key={link.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="p-4 font-medium">{link.platform}</td>
                                                <td className="p-4 max-w-xs truncate text-muted-foreground">{link.url}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-xs text-muted-foreground">{link.icon}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={link.is_active}
                                                            onChange={() => toggleStatus(link)}
                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-sm text-muted-foreground">{link.is_active ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEditModal(link)}>
                                                            <FaPencilAlt className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteLink(link.id)}>
                                                            <FaTrash className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {links.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                No social links found. Add one to get started.
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
                            <DialogTitle>{editingLink ? 'Edit Social Link' : 'Add New Social Link'}</DialogTitle>
                            <DialogDescription>
                                Add a link to your social media profile.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform Name</Label>
                                <Input
                                    id="platform"
                                    value={data.platform}
                                    onChange={(e) => setData('platform', e.target.value)}
                                    placeholder="e.g. Facebook"
                                    required
                                />
                                {errors.platform && <p className="text-sm text-red-500">{errors.platform}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    placeholder="https://facebook.com/yourpage"
                                    required
                                />
                                {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon</Label>
                                <Select
                                    value={data.icon}
                                    onValueChange={(value) => setData('icon', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <option.icon className="w-4 h-4" />
                                                    {option.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>
                                    {editingLink ? 'Update Link' : 'Add Link'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
