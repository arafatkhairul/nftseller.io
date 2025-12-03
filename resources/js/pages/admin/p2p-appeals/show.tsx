import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaCheck, FaQuestionCircle, FaTimes } from 'react-icons/fa';

interface Appeal {
    id: number;
    order_number: string;
    user_name: string;
    user_email: string;
    nft_name: string;
    nft_image: string | null;
    amount: string;
    network: string;
    payment_method: string;
    partner_address: string;
    sender_address: string;
    status: string;
    appeal_reason: string;
    appealed_at: string;
    created_at: string;
}

interface Props {
    appeal: Appeal;
}

export default function AdminP2pAppealShow({ appeal }: Props) {
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isQuestionOpen, setIsQuestionOpen] = useState(false);

    const { data: questionData, setData: setQuestionData, post: postQuestion, processing: questionProcessing, reset: resetQuestion } = useForm({
        question: '',
    });

    const handleApprove = () => {
        router.post(route('admin.p2p-appeals.resolve', appeal.id), {
            action: 'approve',
        }, {
            onSuccess: () => setIsApproveOpen(false),
        });
    };

    const handleReject = () => {
        router.post(route('admin.p2p-appeals.resolve', appeal.id), {
            action: 'reject',
        }, {
            onSuccess: () => setIsRejectOpen(false),
        });
    };

    const handleAskQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        postQuestion(route('admin.p2p-appeals.ask-question', appeal.id), {
            onSuccess: () => {
                setIsQuestionOpen(false);
                resetQuestion();
            },
        });
    };

    const isResolved = appeal.status === 'appeal_approved' || appeal.status === 'appeal_rejected' || appeal.status === 'cancelled';

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'P2P Appeals', href: '/admin/p2p-appeals' },
            { title: `Order #${appeal.order_number}`, href: `/admin/p2p-appeals/${appeal.id}` }
        ]}>
            <Head title={`Appeal - Order #${appeal.order_number}`} />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Appeal Details</h1>
                            <Badge variant={
                                appeal.status === 'appealed' ? 'outline' :
                                    appeal.status === 'appeal_approved' ? 'default' : // Greenish usually
                                        appeal.status === 'appeal_rejected' ? 'destructive' : 'secondary'
                            } className="text-sm capitalize">
                                {appeal.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">Reviewing appeal for Order #{appeal.order_number}</p>
                    </div>
                    {!isResolved && (
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setIsQuestionOpen(true)}>
                                <FaQuestionCircle className="mr-2 h-4 w-4" />
                                Ask Question
                            </Button>
                            <Button variant="destructive" onClick={() => setIsRejectOpen(true)}>
                                <FaTimes className="mr-2 h-4 w-4" />
                                Reject Appeal
                            </Button>
                            <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => setIsApproveOpen(true)}>
                                <FaCheck className="mr-2 h-4 w-4" />
                                Approve Appeal
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Appeal Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Appeal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <Label className="text-xs text-muted-foreground uppercase">Reason for Appeal</Label>
                                <p className="mt-1 text-lg">{appeal.appeal_reason}</p>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span>Submitted by: <span className="font-medium text-foreground">{appeal.user_name}</span> ({appeal.user_email})</span>
                                <span>•</span>
                                <span>Submitted at: {appeal.appealed_at}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Amount</Label>
                                    <p className="font-medium">{appeal.amount} {appeal.network}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Payment Method</Label>
                                    <p className="font-medium">{appeal.payment_method}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-xs text-muted-foreground">Partner Address</Label>
                                    <p className="font-mono text-sm break-all bg-muted p-2 rounded mt-1">{appeal.partner_address}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-xs text-muted-foreground">Sender Address (User)</Label>
                                    <p className="font-mono text-sm break-all bg-muted p-2 rounded mt-1">{appeal.sender_address || 'Not provided'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* NFT Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>NFT Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                {appeal.nft_image && (
                                    <img
                                        src={appeal.nft_image}
                                        alt={appeal.nft_name}
                                        className="w-24 h-24 rounded-lg object-cover border"
                                    />
                                )}
                                <div>
                                    <h3 className="text-lg font-bold">{appeal.nft_name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This NFT is currently locked in escrow pending this appeal resolution.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Approve Dialog */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Appeal</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve this appeal? This will cancel the current P2P transfer and allow the user to retry the transaction or place a new order. The NFT will remain with the seller until a new order is placed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>Confirm Approve</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Appeal</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this appeal? This will mark the transfer as failed/rejected. The user will be notified that their appeal was unsuccessful.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject}>Confirm Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ask Question Dialog */}
            <Dialog open={isQuestionOpen} onOpenChange={setIsQuestionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ask Question</DialogTitle>
                        <DialogDescription>
                            This will create a new support ticket linked to this appeal. The user will be notified and can reply via the support center.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAskQuestion}>
                        <div className="py-4">
                            <Label htmlFor="question">Your Question</Label>
                            <Textarea
                                id="question"
                                value={questionData.question}
                                onChange={(e) => setQuestionData('question', e.target.value)}
                                placeholder="e.g., Please provide proof of payment..."
                                className="mt-2"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsQuestionOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={questionProcessing}>Send Question</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
