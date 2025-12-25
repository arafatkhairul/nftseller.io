import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FaPlus, FaTicketAlt } from 'react-icons/fa';

interface Ticket {
    id: number;
    ticket_unique_id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    last_updated: string;
}

interface Props {
    tickets: Ticket[];
}

export default function SupportIndex({ tickets }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Support Tickets', href: '/support-tickets' }]}>
            <Head title="Support Tickets" />
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Support Tickets</h1>
                        <p className="text-sm md:text-base text-muted-foreground mt-1">Manage your support requests and inquiries.</p>
                    </div>
                    <Link href="/support-tickets/create" className="w-full md:w-auto">
                        <Button className="gap-2 w-full md:w-auto">
                            <FaPlus className="w-4 h-4" />
                            Open New Ticket
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tickets.length > 0 ? (
                            <div className="space-y-4">
                                {tickets.map((ticket) => (
                                    <Link key={ticket.id} href={`/support-tickets/${ticket.id}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold">{ticket.subject}</span>
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{ticket.ticket_unique_id}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    Last updated {ticket.last_updated}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 self-start md:self-auto">
                                                <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                                                    {ticket.priority}
                                                </Badge>
                                                <Badge className={
                                                    ticket.status === 'open' ? 'bg-green-500 hover:bg-green-600' :
                                                        ticket.status === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600' :
                                                            'bg-gray-500 hover:bg-gray-600'
                                                }>
                                                    {ticket.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaTicketAlt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">No tickets found</h3>
                                <p className="text-muted-foreground">You haven't opened any support tickets yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
