<?php

namespace App\Http\Controllers;

use App\Models\Blockchain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlockchainController extends Controller
{
    public function index()
    {
        $blockchains = Blockchain::withCount('nfts')
            ->orderBy('name')
            ->get()
            ->map(function ($blockchain) {
                return [
                    'id' => $blockchain->id,
                    'name' => $blockchain->name,
                    'logo' => $blockchain->logo ? asset('storage/' . $blockchain->logo) : null,
                    'nfts_count' => $blockchain->nfts_count,
                ];
            });

        return Inertia::render('admin/blockchains', [
            'blockchains' => $blockchains,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('blockchains', 'public');
            $validated['logo'] = $path;
        }

        Blockchain::create($validated);

        return redirect()->route('admin.blockchains.index')
            ->with('success', 'Blockchain created successfully!');
    }

    public function update(Request $request, $id)
    {
        $blockchain = Blockchain::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($blockchain->logo) {
                Storage::disk('public')->delete($blockchain->logo);
            }
            $path = $request->file('logo')->store('blockchains', 'public');
            $validated['logo'] = $path;
        }

        $blockchain->update($validated);

        return redirect()->route('admin.blockchains.index')
            ->with('success', 'Blockchain updated successfully!');
    }

    public function destroy($id)
    {
        $blockchain = Blockchain::findOrFail($id);

        // Delete logo if exists
        if ($blockchain->logo) {
            Storage::disk('public')->delete($blockchain->logo);
        }

        $blockchain->delete();

        return redirect()->route('admin.blockchains.index')
            ->with('success', 'Blockchain deleted successfully!');
    }
}
