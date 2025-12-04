import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaCheckCircle, FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa';

interface Artist {
    id: number;
    name: string;
    avatar: string | null;
    is_verified: boolean;
    nfts_count: number;
}

interface Props {
    artists: Artist[];
}

export default function AdminArtists({ artists }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

    // Create Form
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, reset: createReset, errors: createErrors } = useForm({
        name: '',
        avatar: null as File | null,
        is_verified: false,
    });

    // Edit Form
    const { data: editData, setData: setEditData, post: editPost, processing: editProcessing, reset: editReset, errors: editErrors } = useForm({
        name: '',
        avatar: null as File | null,
        is_verified: false,
        _method: 'PUT',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createPost(route('admin.artists.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createReset();
            },
        });
    };

    const handleEditClick = (artist: Artist) => {
        setEditingArtist(artist);
        setEditData({
            name: artist.name,
            avatar: null,
            is_verified: artist.is_verified,
            _method: 'POST', // We use POST for file uploads in Laravel usually, but here we might need to spoof PUT if not uploading file, but for file upload with Inertia, usually POST with _method=PUT works best or just POST. Let's try POST to update route which handles it.
        });
        setIsEditOpen(true);
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingArtist) return;

        // Use router.post with forceFormData for file uploads
        router.post(route('admin.artists.update', editingArtist.id), {
            _method: 'POST',
            name: editData.name,
            avatar: editData.avatar,
            is_verified: editData.is_verified ? '1' : '0',
        }, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditOpen(false);
                editReset();
                setEditingArtist(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this artist?')) {
            router.delete(route('admin.artists.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Artists', href: '/admin/artists' }
        ]}>
            <Head title="Manage Artists" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
                        <p className="text-muted-foreground mt-1">Manage NFT artists and creators.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <FaPlus className="w-4 h-4" />
                        Add Artist
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Artists</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {artists.length > 0 ? (
                                artists.map((artist) => (
                                    <div key={artist.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                                {artist.avatar ? (
                                                    <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaUser className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-lg">{artist.name}</span>
                                                    {artist.is_verified && (
                                                        <FaCheckCircle className="w-4 h-4 text-blue-500" title="Verified" />
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {artist.nfts_count} NFTs
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEditClick(artist)}
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(artist.id)}
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No artists found. Create one to get started.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Artist</DialogTitle>
                            <DialogDescription>Create a new artist profile.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={createData.name}
                                    onChange={(e) => setCreateData('name', e.target.value)}
                                    required
                                />
                                {createErrors.name && <p className="text-sm text-red-500">{createErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="avatar">Avatar</Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCreateData('avatar', e.target.files ? e.target.files[0] : null)}
                                />
                                {createErrors.avatar && <p className="text-sm text-red-500">{createErrors.avatar}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_verified"
                                    checked={createData.is_verified}
                                    onCheckedChange={(checked: boolean) => setCreateData('is_verified', checked)}
                                />
                                <Label htmlFor="is_verified">Verified Artist</Label>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={createProcessing}>Create Artist</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Artist</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    required
                                />
                                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-avatar">Avatar (Leave empty to keep current)</Label>
                                <Input
                                    id="edit-avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditData('avatar', e.target.files ? e.target.files[0] : null)}
                                />
                                {editErrors.avatar && <p className="text-sm text-red-500">{editErrors.avatar}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-is_verified"
                                    checked={editData.is_verified}
                                    onCheckedChange={(checked: boolean) => setEditData('is_verified', checked)}
                                />
                                <Label htmlFor="edit-is_verified">Verified Artist</Label>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={editProcessing}>Update Artist</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
