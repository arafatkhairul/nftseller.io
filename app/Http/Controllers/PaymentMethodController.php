<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of payment methods
     */
    public function index()
    {
        $paymentMethods = PaymentMethod::orderBy('sort_order')->get();

        return Inertia::render('admin/payment-methods', [
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Get active payment methods for checkout (API endpoint)
     */
    public function getActive()
    {
        return response()->json(PaymentMethod::getActive());
    }

    /**
     * Store a newly created payment method
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:payment_methods,name',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'wallet_address' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('payment-methods', 'public');
            $validated['logo_path'] = $path;
        }

        PaymentMethod::create($validated);

        return back()->with('success', 'Payment method created successfully!');
    }

    /**
     * Update the specified payment method
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:payment_methods,name,' . $paymentMethod->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'wallet_address' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($paymentMethod->logo_path && Storage::disk('public')->exists($paymentMethod->logo_path)) {
                Storage::disk('public')->delete($paymentMethod->logo_path);
            }
            $path = $request->file('logo')->store('payment-methods', 'public');
            $validated['logo_path'] = $path;
        }

        $paymentMethod->update($validated);

        return back()->with('success', 'Payment method updated successfully!');
    }

    /**
     * Delete the specified payment method
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();

        return back()->with('success', 'Payment method deleted successfully!');
    }
}
