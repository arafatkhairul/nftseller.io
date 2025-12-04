<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArtistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $artists = Artist::latest()->get()->map(function ($artist) {
            return [
                'id' => $artist->id,
                'name' => $artist->name,
                'avatar' => $artist->avatar ? asset('storage/' . $artist->avatar) : null,
                'is_verified' => $artist->is_verified,
                'nfts_count' => $artist->nfts()->count(),
            ];
        });

        return Inertia::render('admin/artists', [
            'artists' => $artists,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048', // 2MB Max
            'is_verified' => 'boolean',
        ]);

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('artists', 'public');
        }

        Artist::create([
            'name' => $validated['name'],
            'avatar' => $avatarPath,
            'is_verified' => $validated['is_verified'] ?? false,
        ]);

        return back()->with('success', 'Artist created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $artist = Artist::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048',
            'is_verified' => 'boolean',
        ]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($artist->avatar) {
                Storage::disk('public')->delete($artist->avatar);
            }
            $artist->avatar = $request->file('avatar')->store('artists', 'public');
        }

        $artist->name = $validated['name'];
        $artist->is_verified = $validated['is_verified'] ?? false;
        $artist->save();

        return back()->with('success', 'Artist updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $artist = Artist::findOrFail($id);

        if ($artist->avatar) {
            Storage::disk('public')->delete($artist->avatar);
        }

        $artist->delete();

        return back()->with('success', 'Artist deleted successfully.');
    }
}
