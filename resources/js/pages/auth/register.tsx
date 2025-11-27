import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo and Header - Vercel Style */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block">
                            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center mx-auto mb-6">
                                <span className="text-xl font-bold text-background">N</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details to get started
                        </p>
                    </div>

                    {/* Register Form Card - Vercel Style */}
                    <div className="vercel-card border rounded-2xl p-8">
                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="John Doe"
                                            className="h-11"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            className="h-11"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Create a password"
                                            className="h-11"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                            Confirm password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm your password"
                                            className="h-11"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* Register Button - Vercel Style */}
                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-xl font-medium"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        {processing ? 'Creating account...' : 'Create account'}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <TextLink
                                    href={login()}
                                    className="text-foreground hover:underline font-medium"
                                    tabIndex={6}
                                >
                                    Sign in
                                </TextLink>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            By creating an account, you agree to our{' '}
                            <Link href="/terms" className="hover:text-foreground transition-colors underline">
                                Terms
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="hover:text-foreground transition-colors underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
