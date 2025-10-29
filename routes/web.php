<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('nft-marketplace');
})->name('home');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/nft-marketplace', function () {
    return Inertia::render('nft-marketplace');
})->name('nft-marketplace');

// Order confirmation screen after manual payment submission
Route::get('/order-confirmation', function () {
    return Inertia::render('order-confirmation');
})->name('order-confirmation');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
