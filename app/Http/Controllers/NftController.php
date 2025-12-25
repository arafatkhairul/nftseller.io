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
    /**
     * Display a listing of all NFTs
     */
    public function index()
    {
        $userId = auth()->id();

        $nfts = Nft::with(['creator', 'category', 'artist', 'blockchainRelation'])
            ->withCount('likedByUsers as user_likes_count')
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function ($nft) use ($userId) {
                return [
                    'id' => $nft->id,
                    'name' => $nft->name,
                    'description' => $nft->description,
                    'image_url' => $nft->image_path ? asset('storage/' . $nft->image_path) : null,
                    'price' => $nft->price,
                    'quantity' => $nft->quantity,
                    'blockchain' => $nft->blockchain,
                    'blockchain_data' => $nft->relationLoaded('blockchainRelation') && $nft->blockchainRelation ? [
                        'id' => $nft->blockchainRelation->id,
                        'name' => $nft->blockchainRelation->name,
                        'logo' => $nft->blockchainRelation->logo ? asset('storage/' . $nft->blockchainRelation->logo) : null,
                        'exchange_rate' => $nft->blockchainRelation->exchange_rate,
                    ] : null,
                    'status' => $nft->status,
                    'creator' => $nft->creator ? [
                        'id' => $nft->creator->id,
                        'name' => $nft->creator->name,
                    ] : null,
                    'artist' => $nft->artist ? [
                        'id' => $nft->artist->id,
                        'name' => $nft->artist->name,
                        'avatar' => $nft->artist->avatar ? asset('storage/' . $nft->artist->avatar) : null,
                        'is_verified' => $nft->artist->is_verified,
                    ] : null,
                    'category' => $nft->category ? $nft->category->name : null,
                    'views' => $nft->views,
                    'likes' => $nft->likes + $nft->user_likes_count,
                    'is_liked' => $userId ? $nft->likedByUsers()->where('user_id', $userId)->exists() : false,
                    'rarity' => $nft->rarity,
                    'properties' => $nft->properties,
                ];
            });

        $categories = \App\Models\Category::where('is_active', true)->orderBy('name')->get();

        // Get active hero banners
        $heroBanners = \App\Models\HeroBanner::where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'creator' => $banner->creator,
                    'isVerified' => $banner->is_verified,
                    'backgroundImage' => $banner->background_image 
                        ? (str_starts_with($banner->background_image, 'http') 
                            ? $banner->background_image 
                            : asset('storage/' . $banner->background_image))
                        : null,
                    'stats' => [
                        'floorPrice' => ['eth' => (float) $banner->floor_price],
                        'items' => $banner->items,
                        'totalVolume' => ['eth' => (float) $banner->total_volume],
                        'listed' => (float) $banner->listed_percentage,
                    ],
                    'featuredNFTs' => collect($banner->featured_nfts ?? [])->map(function ($nftData, $index) {
                        $image = $nftData['image'] ?? '';
                        // Check if image is a URL or a storage path
                        if ($image && !str_starts_with($image, 'http')) {
                            $image = asset('storage/' . $image);
                        }
                        
                        return [
                            'id' => $nftData['id'] ?? "featured-{$index}",
                            'image' => $image,
                            'name' => $nftData['name'] ?? "NFT #{$index}",
                        ];
                    })->toArray(),
                ];
            });

        return Inertia::render('nft-marketplace', [
            'nfts' => $nfts,
            'categories' => $categories,
            'heroBanners' => $heroBanners,
        ]);
    }

    /**
     * Show NFT management page in admin
     */
    public function manage()
    {
        $nfts = Nft::with(['creator', 'artist', 'blockchainRelation'])
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
                    'blockchain_id' => $nft->blockchain_id,
                    'contract_address' => $nft->contract_address,
                    'token_id' => $nft->token_id,
                    'status' => $nft->status,
                    'rarity' => $nft->rarity,
                    'views' => $nft->views,
                    'likes' => $nft->likes,
                    'properties' => $nft->properties,
                    'category_id' => $nft->category_id,
                    'artist_id' => $nft->artist_id,
                    'creator' => $nft->creator ? $nft->creator->name : 'Unknown',
                    'created_at' => $nft->created_at->format('Y-m-d'),
                ];
            });

        $categories = \App\Models\Category::where('is_active', true)->get();
        $artists = \App\Models\Artist::orderBy('name')->get();
        $blockchains = \App\Models\Blockchain::orderBy('name')->get();

        return Inertia::render('admin/nfts', [
            'nfts' => $nfts,
            'categories' => $categories,
            'artists' => $artists,
            'blockchains' => $blockchains,
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
            'blockchain_id' => 'nullable|exists:blockchains,id',
            'contract_address' => 'nullable|string',
            'token_id' => 'nullable|string',
            'status' => 'required|in:active,inactive,sold',
            'category_id' => 'nullable|exists:categories,id',
            'artist_id' => 'nullable|exists:artists,id',
            'rarity' => 'nullable|string',
            'views' => 'nullable|integer|min:0',
            'likes' => 'nullable|integer|min:0',
            'properties' => 'nullable|json',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('nfts', 'public');
            $validated['image_path'] = $path;
        }

        if (isset($validated['properties'])) {
            $validated['properties'] = json_decode($validated['properties'], true);
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
            'blockchain_id' => 'nullable|exists:blockchains,id',
            'contract_address' => 'nullable|string',
            'token_id' => 'nullable|string',
            'status' => 'required|in:active,inactive,sold',
            'category_id' => 'nullable|exists:categories,id',
            'artist_id' => 'nullable|exists:artists,id',
            'rarity' => 'nullable|string',
            'views' => 'nullable|integer|min:0',
            'likes' => 'nullable|integer|min:0',
            'properties' => 'nullable|json',
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

        if (isset($validated['properties'])) {
            $validated['properties'] = json_decode($validated['properties'], true);
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

    /**
     * Toggle like status for an NFT
     */
    public function toggleLike(Nft $nft)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth()->user();
        $isLiked = $nft->likedByUsers()->where('user_id', $user->id)->exists();

        if ($isLiked) {
            $nft->likedByUsers()->detach($user->id);
            $liked = false;
        } else {
            $nft->likedByUsers()->attach($user->id);
            $liked = true;
        }

        return response()->json([
            'success' => true,
            'liked' => $liked,
            'likes_count' => $nft->likes + $nft->likedByUsers()->count(),
        ]);
    }
}
