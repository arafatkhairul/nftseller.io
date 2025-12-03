<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback()
    {
        try {
            \Illuminate\Support\Facades\Log::info('Google Auth Callback Hit');
            
            $googleUser = Socialite::driver('google')->user();
            
            \Illuminate\Support\Facades\Log::info('Google User Retrieved', ['email' => $googleUser->getEmail()]);

            // Find or create user
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                \Illuminate\Support\Facades\Log::info('User found, updating...');
                // Update existing user with Google ID if not set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }
                
                // Ensure email is verified for Google users
                if (!$user->email_verified_at) {
                    $user->update(['email_verified_at' => now()]);
                }
            } else {
                \Illuminate\Support\Facades\Log::info('User not found, creating...');
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(24)), // Random password
                    'email_verified_at' => now(), // Auto-verify email for Google users
                    'role' => 'user',
                ]);
            }

            // Log the user in
            Auth::login($user, true);
            
            \Illuminate\Support\Facades\Log::info('User logged in, redirecting to dashboard');

            // Redirect to dashboard
            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Failed to authenticate with Google. Please try again.');
        }
    }
}
