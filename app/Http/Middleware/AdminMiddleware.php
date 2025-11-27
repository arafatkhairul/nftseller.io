<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and has admin role
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Redirect non-admin users to dashboard
        return redirect()->route('dashboard')->with('error', 'You do not have admin access.');
    }
}
