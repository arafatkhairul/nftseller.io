<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\NftController::class, 'index'])->name('home');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/nft-marketplace', [\App\Http\Controllers\NftController::class, 'index'])->name('nft-marketplace');

// Public API routes
Route::get('/admin/payment-methods/active', [\App\Http\Controllers\PaymentMethodController::class, 'getActive']);

// Order confirmation screen after manual payment submission
Route::get('/order-confirmation', function () {
    // Get order from session flash data
    $order = session('order');

    return Inertia::render('order-confirmation', [
        'order' => $order,
    ]);
})->name('order-confirmation');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $orders = auth()->user()->orders()
            ->with('nft')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'nft_id' => $order->nft_id,
                    'nft_name' => $order->nft->name ?? 'Unknown',
                    'nft_image' => $order->nft->image_path ? asset('storage/' . $order->nft->image_path) : null,
                    'total_price' => $order->total_price,
                    'quantity' => $order->quantity,
                    'payment_method' => $order->payment_method,
                    'transaction_id' => $order->transaction_id,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                    'created_at_diff' => $order->created_at->diffForHumans(),
                ];
            });

        $completedOrdersTotal = auth()->user()->orders()
            ->where('status', 'completed')
            ->sum('total_price');

        return Inertia::render('dashboard', [
            'orders' => $orders,
            'completedOrdersTotal' => $completedOrdersTotal,
        ]);
    })->name('dashboard');

    // User Orders Routes
    Route::get('orders', [\App\Http\Controllers\OrderController::class, 'userOrders'])->name('orders.index');
    Route::post('orders', [\App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{order}', [\App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/sent-request', [\App\Http\Controllers\OrderController::class, 'submitSentRequest'])->name('orders.sent-request');

    // P2P Transfer Routes (authenticated)
    Route::post('p2p-transfer/{id}/payment-completed', [\App\Http\Controllers\P2pTransferController::class, 'markPaymentCompleted'])->name('p2p-transfer.payment-completed');
    Route::post('p2p-transfer/{id}/release', [\App\Http\Controllers\P2pTransferController::class, 'release'])->name('p2p-transfer.release');
    Route::post('p2p-transfer/{id}/appeal', [\App\Http\Controllers\P2pTransferController::class, 'appeal'])->name('p2p-transfer.appeal');
    // Support Ticket Routes
    Route::get('support-tickets', [\App\Http\Controllers\SupportTicketController::class, 'index'])->name('support.index');
    Route::get('support-tickets/create', [\App\Http\Controllers\SupportTicketController::class, 'create'])->name('support.create');
    Route::post('support-tickets', [\App\Http\Controllers\SupportTicketController::class, 'store'])->name('support.store');
    Route::get('support-tickets/{ticket}', [\App\Http\Controllers\SupportTicketController::class, 'show'])->name('support.show');
    Route::post('support-tickets/{ticket}/reply', [\App\Http\Controllers\SupportTicketController::class, 'reply'])->name('support.reply');
});

// P2P Transfer Public Routes
Route::get('p2p-transfer/{code}', [\App\Http\Controllers\P2pTransferController::class, 'show'])->name('p2p-transfer.show');

// P2P Transfer API Routes
Route::post('api/p2p-transfer/create', [\App\Http\Controllers\P2pTransferController::class, 'create'])->middleware('auth');
Route::get('api/p2p-transfer/{id}/status', [\App\Http\Controllers\P2pTransferController::class, 'getStatus']);

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('analytics', [\App\Http\Controllers\AdminController::class, 'analytics'])->name('analytics');
    Route::get('users', [\App\Http\Controllers\AdminController::class, 'users'])->name('users');
    Route::put('users/{user}', [\App\Http\Controllers\AdminController::class, 'updateUser'])->name('users.update');
    Route::delete('users/{user}', [\App\Http\Controllers\AdminController::class, 'destroyUser'])->name('users.destroy');
    Route::get('orders', [\App\Http\Controllers\OrderController::class, 'adminOrders'])->name('orders');
    Route::get('orders/pending-sent', [\App\Http\Controllers\OrderController::class, 'adminPendingSent'])->name('orders.pending-sent');
    Route::post('orders/{id}/approve-sent', [\App\Http\Controllers\OrderController::class, 'approveSentRequest'])->name('orders.approve-sent');
    Route::post('orders/{id}/reject-sent', [\App\Http\Controllers\OrderController::class, 'rejectSentRequest'])->name('orders.reject-sent');
    Route::patch('orders/{order}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::get('settings', [\App\Http\Controllers\AdminController::class, 'settings'])->name('settings');

    // NFT Management Routes
    Route::get('nfts', [\App\Http\Controllers\NftController::class, 'manage'])->name('nfts.manage');
    Route::post('nfts', [\App\Http\Controllers\NftController::class, 'store'])->name('nfts.store');
    Route::put('nfts/{nft}', [\App\Http\Controllers\NftController::class, 'update'])->name('nfts.update');
    Route::delete('nfts/{nft}', [\App\Http\Controllers\NftController::class, 'destroy'])->name('nfts.destroy');

    // Payment Methods Routes
    Route::get('payment-methods', [\App\Http\Controllers\PaymentMethodController::class, 'index'])->name('payment-methods.index');
    Route::post('payment-methods', [\App\Http\Controllers\PaymentMethodController::class, 'store'])->name('payment-methods.store');
    Route::put('payment-methods/{paymentMethod}', [\App\Http\Controllers\PaymentMethodController::class, 'update'])->name('payment-methods.update');
    Route::delete('payment-methods/{paymentMethod}', [\App\Http\Controllers\PaymentMethodController::class, 'destroy'])->name('payment-methods.destroy');

    // P2P Appeals Routes
    Route::get('p2p-appeals', [\App\Http\Controllers\P2pTransferController::class, 'adminAppeals'])->name('p2p-appeals.index');
    Route::get('p2p-appeals/{id}', [\App\Http\Controllers\P2pTransferController::class, 'adminAppealShow'])->name('p2p-appeals.show');
    Route::post('p2p-appeals/{id}/resolve', [\App\Http\Controllers\P2pTransferController::class, 'resolveAppeal'])->name('p2p-appeals.resolve');
    Route::post('p2p-appeals/{id}/ask-question', [\App\Http\Controllers\P2pTransferController::class, 'askQuestion'])->name('p2p-appeals.ask-question');

    // Support Ticket Admin Routes
    Route::get('/support-tickets', [\App\Http\Controllers\SupportTicketController::class, 'adminIndex'])->name('support.index');
    Route::get('/support-tickets/{id}', [\App\Http\Controllers\SupportTicketController::class, 'adminShow'])->name('support.show');
    Route::post('/support-tickets/{id}/reply', [\App\Http\Controllers\SupportTicketController::class, 'adminReply'])->name('support.reply');
    Route::put('/support-tickets/{id}/status', [\App\Http\Controllers\SupportTicketController::class, 'updateStatus'])->name('support.status');
    Route::delete('/support-tickets/{id}', [\App\Http\Controllers\SupportTicketController::class, 'destroy'])->name('support.destroy');

    // Social Links
    Route::get('/settings/social-links', [\App\Http\Controllers\SocialLinkController::class, 'index'])->name('settings.social-links');
    Route::post('/settings/social-links', [\App\Http\Controllers\SocialLinkController::class, 'store'])->name('settings.social-links.store');
    Route::put('/settings/social-links/{id}', [\App\Http\Controllers\SocialLinkController::class, 'update'])->name('settings.social-links.update');
    Route::delete('/settings/social-links/{id}', [\App\Http\Controllers\SocialLinkController::class, 'destroy'])->name('settings.social-links.destroy');
    // Categories
    Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.destroy');
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
