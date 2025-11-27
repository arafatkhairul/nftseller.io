import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />
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
                            Welcome Back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 p-3 bg-accent border border-border rounded-xl">
                            <p className="text-sm text-foreground text-center">
                                {status}
                            </p>
                        </div>
                    )}

                    {/* Login Form Card - Vercel Style */}
                    <div className="vercel-card border rounded-2xl p-8">
                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className="h-11"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    tabIndex={3}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="h-11 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            Remember me for 30 days
                                        </Label>
                                    </div>

                                    {/* Login Button - Vercel Style */}
                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-xl font-medium"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        {processing ? 'Signing in...' : 'Sign in'}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink
                                    href={register()}
                                    className="text-foreground hover:underline font-medium"
                                    tabIndex={5}
                                >
                                    Sign up
                                </TextLink>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            By signing in, you agree to our{' '}
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
