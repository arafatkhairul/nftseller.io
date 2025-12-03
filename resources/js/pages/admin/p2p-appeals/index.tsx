import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface Appeal {
    id: number;
    order_number: string;
    user_name: string;
    user_email: string;
    nft_name: string;
    amount: string;
    network: string;
    status: string;
    appeal_reason: string;
    appealed_at: string;
}

interface Props {
    appeals: Appeal[];
}

export default function AdminP2pAppealsIndex({ appeals }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'P2P Appeals', href: '/admin/p2p-appeals' }
        ]}>
            <Head title="P2P Appeals" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">P2P Appeals</h1>
                        <p className="text-muted-foreground mt-1">Manage and resolve P2P transfer disputes.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Appeals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {appeals.length > 0 ? (
                            <div className="space-y-4">
                                {appeals.map((appeal) => (
                                    <Link key={appeal.id} href={`/admin/p2p-appeals/${appeal.id}`}>
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">Order #{appeal.order_number}</span>
                                                    <Badge variant={
                                                        appeal.status === 'appealed' ? 'outline' :
                                                            appeal.status === 'appeal_approved' ? 'default' :
                                                                appeal.status === 'appeal_rejected' ? 'destructive' : 'secondary'
                                                    } className="flex items-center gap-1 capitalize">
                                                        {appeal.status === 'appealed' && <FaExclamationTriangle className="w-3 h-3" />}
                                                        {appeal.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    By {appeal.user_name} ({appeal.user_email}) • {appeal.appealed_at}
                                                </div>
                                                <p className="text-sm mt-2 line-clamp-1">
                                                    <span className="font-medium">Reason:</span> {appeal.appeal_reason}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{appeal.amount} {appeal.network}</div>
                                                <div className="text-sm text-muted-foreground">{appeal.nft_name}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaExclamationTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">No active appeals</h3>
                                <p className="text-muted-foreground">There are no P2P appeals requiring attention.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
