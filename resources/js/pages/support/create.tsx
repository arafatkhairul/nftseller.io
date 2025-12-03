import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaPaperPlane, FaShieldAlt } from 'react-icons/fa';

export default function SupportCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        priority: 'medium',
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/support-tickets');
    };

    const priorities = [
        {
            id: 'low',
            label: 'Low Priority',
            description: 'General questions or feedback',
            color: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
            iconColor: 'text-blue-500',
        },
        {
            id: 'medium',
            label: 'Medium Priority',
            description: 'Minor issues affecting experience',
            color: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50',
            iconColor: 'text-yellow-500',
        },
        {
            id: 'high',
            label: 'High Priority',
            description: 'Critical issues or payment problems',
            color: 'bg-red-500/10 border-red-500/20 hover:border-red-500/50',
            iconColor: 'text-red-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Support Tickets', href: '/support-tickets' },
            { title: 'New Ticket', href: '/support-tickets/create' }
        ]}>
            <Head title="Open New Ticket" />

            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Submit a Request</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        We're here to help! Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-muted/50 shadow-sm">
                            <CardHeader>
                                <CardTitle>Ticket Details</CardTitle>
                                <CardDescription>Please provide as much detail as possible to help us assist you.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="flex flex-col gap-8">
                                    {/* Subject Field */}
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="subject" className="text-base font-semibold text-foreground/90">
                                            Subject <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="Briefly describe the issue you are facing..."
                                            className="h-12 text-base bg-muted/30 focus:bg-background border-muted-foreground/20 focus:border-primary transition-all duration-200"
                                            required
                                        />
                                        {errors.subject && <p className="text-sm text-red-500 flex items-center gap-1 mt-1"><FaExclamationCircle /> {errors.subject}</p>}
                                    </div>

                                    {/* Priority Selection */}
                                    <div className="flex flex-col gap-3">
                                        <Label className="text-base font-semibold text-foreground/90">
                                            Priority Level <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {priorities.map((priority) => (
                                                <div
                                                    key={priority.id}
                                                    onClick={() => setData('priority', priority.id)}
                                                    className={cn(
                                                        "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 relative overflow-hidden group",
                                                        priority.color,
                                                        data.priority === priority.id
                                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent bg-background"
                                                            : "bg-card hover:border-primary/50 hover:shadow-md"
                                                    )}
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className={cn("font-semibold group-hover:text-foreground transition-colors", priority.iconColor)}>
                                                                {priority.label}
                                                            </span>
                                                            {data.priority === priority.id && (
                                                                <FaCheckCircle className={cn("w-4 h-4", priority.iconColor)} />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {priority.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.priority && <p className="text-sm text-red-500 flex items-center gap-1 mt-1"><FaExclamationCircle /> {errors.priority}</p>}
                                    </div>

                                    {/* Message Field */}
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="message" className="text-base font-semibold text-foreground/90">
                                            Description <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Please provide detailed information about your issue. Include transaction IDs, error messages, and steps to reproduce the problem..."
                                            className="min-h-[200px] text-base bg-muted/30 focus:bg-background border-muted-foreground/20 focus:border-primary transition-all duration-200 resize-y p-4 leading-relaxed"
                                            required
                                        />
                                        {errors.message && <p className="text-sm text-red-500 flex items-center gap-1 mt-1"><FaExclamationCircle /> {errors.message}</p>}
                                    </div>

                                    <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => window.history.back()}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 px-8 text-base font-medium gap-2 shadow-lg hover:shadow-primary/20 transition-all min-w-[160px]"
                                        >
                                            {processing ? (
                                                'Submitting...'
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="w-4 h-4" />
                                                    Submit Ticket
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info Section */}
                    <div className="space-y-6">
                        {/* Support Info Card */}
                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                    <FaShieldAlt className="w-5 h-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Support Center</CardTitle>
                                <CardDescription>
                                    Our support team is available 24/7 to assist you with any issues.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm space-y-2">
                                    <p className="font-medium text-foreground">Average Response Times:</p>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            High Priority: &lt; 2 hours
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                            Medium Priority: &lt; 12 hours
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            Low Priority: &lt; 24 hours
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FaInfoCircle className="w-4 h-4 text-muted-foreground" />
                                    <CardTitle className="text-base">Before you submit</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-4">
                                    <li>Check our FAQ section for quick answers.</li>
                                    <li>Include your Transaction ID if related to a payment.</li>
                                    <li>Provide screenshots if possible (upload coming soon).</li>
                                    <li>Be specific about the error message you received.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
