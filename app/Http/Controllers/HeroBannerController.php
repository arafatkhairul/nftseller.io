<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HeroBannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = \App\Models\HeroBanner::orderBy('display_order')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'creator' => $banner->creator,
                    'is_verified' => $banner->is_verified,
                    'background_image' => $banner->background_image 
                        ? (str_starts_with($banner->background_image, 'http') 
                            ? $banner->background_image 
                            : asset('storage/' . $banner->background_image))
                        : null,
                    'floor_price' => $banner->floor_price,
                    'items' => $banner->items,
                    'total_volume' => $banner->total_volume,
                    'listed_percentage' => $banner->listed_percentage,
                    'featured_nfts' => $banner->featured_nfts,
                    'display_order' => $banner->display_order,
                    'is_active' => $banner->is_active,
                    'created_at' => $banner->created_at->format('Y-m-d'),
                ];
            });

        return \Inertia\Inertia::render('admin/hero-banners', [
            'banners' => $banners,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'creator' => 'required|string|max:255',
            'is_verified' => 'boolean',
            'background_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'floor_price' => 'required|numeric|min:0',
            'items' => 'required|integer|min:0',
            'total_volume' => 'required|numeric|min:0',
            'listed_percentage' => 'required|numeric|min:0|max:100',
            'display_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle background image upload
        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('hero-banners', 'public');
            $validated['background_image'] = $path;
        }

        // Set empty array for featured_nfts
        $validated['featured_nfts'] = [];

        \App\Models\HeroBanner::create($validated);

        return redirect()->route('admin.hero-banners.index')
            ->with('success', 'Hero banner created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $banner = \App\Models\HeroBanner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'creator' => 'required|string|max:255',
            'is_verified' => 'boolean',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'floor_price' => 'required|numeric|min:0',
            'items' => 'required|integer|min:0',
            'total_volume' => 'required|numeric|min:0',
            'listed_percentage' => 'required|numeric|min:0|max:100',
            'display_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle background image upload if new image provided
        if ($request->hasFile('background_image')) {
            // Delete old image if exists and is not a URL
            if ($banner->background_image && !str_starts_with($banner->background_image, 'http') && \Storage::disk('public')->exists($banner->background_image)) {
                \Storage::disk('public')->delete($banner->background_image);
            }

            $path = $request->file('background_image')->store('hero-banners', 'public');
            $validated['background_image'] = $path;
        }

        // Set empty array for featured_nfts
        $validated['featured_nfts'] = [];

        $banner->update($validated);

        return redirect()->route('admin.hero-banners.index')
            ->with('success', 'Hero banner updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $banner = \App\Models\HeroBanner::findOrFail($id);

        // Delete background image if exists
        if ($banner->background_image && \Storage::disk('public')->exists($banner->background_image)) {
            \Storage::disk('public')->delete($banner->background_image);
        }

        $banner->delete();

        return redirect()->route('admin.hero-banners.index')
            ->with('success', 'Hero banner deleted successfully!');
    }
}
