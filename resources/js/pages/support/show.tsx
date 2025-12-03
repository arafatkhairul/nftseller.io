import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaUserShield } from 'react-icons/fa';

interface Message {
    id: number;
    user_name: string;
    user_avatar: string | null;
    message: string;
    is_admin: boolean;
    created_at: string;
    is_me: boolean;
}

interface Ticket {
    id: number;
    ticket_unique_id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
}

interface Props {
    ticket: Ticket;
    messages: Message[];
}

export default function SupportShow({ ticket, messages }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/support-tickets/${ticket.id}/reply`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Support Tickets', href: '/support-tickets' },
            { title: ticket.ticket_unique_id, href: `/support-tickets/${ticket.id}` }
        ]}>
            <Head title={`Ticket ${ticket.ticket_unique_id}`} />
            <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
                {/* Ticket Header */}
                <Card className="flex-shrink-0">
                    <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold">{ticket.subject}</h1>
                                    <Badge variant="outline">{ticket.ticket_unique_id}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Created on {ticket.created_at}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                                    {ticket.priority}
                                </Badge>
                                <Badge className={
                                    ticket.status === 'open' ? 'bg-green-500' :
                                        ticket.status === 'in_progress' ? 'bg-blue-500' :
                                            'bg-gray-500'
                                }>
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.is_me ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.is_admin ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {msg.user_avatar ? (
                                        <img src={msg.user_avatar} alt={msg.user_name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        msg.is_admin ? <FaUserShield /> : <FaUser />
                                    )}
                                </div>
                                <div className={`flex flex-col max-w-[80%] ${msg.is_me ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold">{msg.user_name}</span>
                                        <span className="text-[10px] text-muted-foreground">{msg.created_at}</span>
                                    </div>
                                    <div className={`p-3 rounded-lg text-sm ${msg.is_me
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-muted rounded-tl-none'
                                        }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Reply Area */}
                    <div className="p-4 border-t bg-background">
                        <form onSubmit={submit} className="flex gap-4">
                            <Textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Type your reply..."
                                className="min-h-[60px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        submit(e as any);
                                    }
                                }}
                            />
                            <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={processing || !data.message.trim()}>
                                <FaPaperPlane className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
