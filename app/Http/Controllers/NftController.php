<?php

namespace App\Http\Controllers;

use App\Models\Nft;
use Inertia\Inertia;
use Illuminate\Http\Request;

class NftController extends Controller
{
    /**
     * Display a listing of all NFTs
     */
    public function index()
    {
        $nfts = Nft::with(['creator', 'category'])
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function ($nft) {
                return [
                    'id' => $nft->id,
                    'name' => $nft->name,
                    'description' => $nft->description,
                    'image_url' => $nft->image_path ? asset('storage/' . $nft->image_path) : null,
                    'price' => $nft->price,
                    'blockchain' => $nft->blockchain,
                    'status' => $nft->status,
                    'creator' => $nft->creator ? [
                        'id' => $nft->creator->id,
                        'name' => $nft->creator->name,
                    ] : null,
                    'category' => $nft->category ? $nft->category->name : null,
                    'views' => $nft->views,
                    'likes' => $nft->likes,
                    'rarity' => $nft->rarity,
                ];
            });

        $categories = \App\Models\Category::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('nft-marketplace', [
            'nfts' => $nfts,
            'categories' => $categories,
        ]);
    }

    /**
     * Show NFT management page in admin
     */
    /**
     * Show NFT management page in admin
     */
    public function manage()
    {
        $nfts = Nft::with('creator')
            ->latest()
            ->get()
            ->map(function ($nft) {
                return [
                    'id' => $nft->id,
                    'name' => $nft->name,
                    'description' => $nft->description,
                    'image_url' => $nft->image_path ? asset('storage/' . $nft->image_path) : null,
                    'price' => $nft->price,
                    'quantity' => $nft->quantity,
                    'blockchain' => $nft->blockchain,
                    'contract_address' => $nft->contract_address,
                    'token_id' => $nft->token_id,
                    'status' => $nft->status,
                    'rarity' => $nft->rarity,
                    'views' => $nft->views,
                    'likes' => $nft->likes,
                    'category_id' => $nft->category_id,
                    'creator' => $nft->creator ? $nft->creator->name : 'Unknown',
                    'created_at' => $nft->created_at->format('Y-m-d'),
                ];
            });

        $categories = \App\Models\Category::where('is_active', true)->get();

        return Inertia::render('admin/nfts', [
            'nfts' => $nfts,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'required|numeric|min:0.01',
            'quantity' => 'required|integer|min:1',
            'blockchain' => 'required|string',
            'contract_address' => 'nullable|string',
            'token_id' => 'nullable|string',
            'status' => 'required|in:active,inactive,sold',
            'category_id' => 'nullable|exists:categories,id',
            'rarity' => 'nullable|string',
            'views' => 'nullable|integer|min:0',
            'likes' => 'nullable|integer|min:0',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('nfts', 'public');
            $validated['image_path'] = $path;
        }

        $validated['creator_id'] = auth()->id();

        $nft = Nft::create($validated);

        return redirect()->route('admin.nfts.manage')
            ->with('success', 'NFT created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nft $nft)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'required|numeric|min:0.01',
            'quantity' => 'required|integer|min:1',
            'blockchain' => 'required|string',
            'contract_address' => 'nullable|string',
            'token_id' => 'nullable|string',
            'status' => 'required|in:active,inactive,sold',
            'category_id' => 'nullable|exists:categories,id',
            'rarity' => 'nullable|string',
            'views' => 'nullable|integer|min:0',
            'likes' => 'nullable|integer|min:0',
        ]);

        // Handle file upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($nft->image_path && \Storage::disk('public')->exists($nft->image_path)) {
                \Storage::disk('public')->delete($nft->image_path);
            }

            $path = $request->file('image')->store('nfts', 'public');
            $validated['image_path'] = $path;
        }

        $nft->update($validated);

        return redirect()->route('admin.nfts.manage')
            ->with('success', 'NFT updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nft $nft)
    {
        // Delete image file if exists
        if ($nft->image_path && \Storage::disk('public')->exists($nft->image_path)) {
            \Storage::disk('public')->delete($nft->image_path);
        }

        $nft->delete();

        return redirect()->route('admin.nfts.manage')
            ->with('success', 'NFT deleted successfully!');
    }
}
