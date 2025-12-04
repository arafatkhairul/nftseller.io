<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class P2pNetworkController extends Controller
{
    public function index()
    {
        $networks = \App\Models\P2pNetwork::latest()->get();
        return \Inertia\Inertia::render('admin/p2p-networks', [
            'networks' => $networks
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:p2p_networks',
            'currency_symbol' => 'required|string|max:10',
            'is_active' => 'boolean',
        ]);

        \App\Models\P2pNetwork::create($validated);

        return redirect()->back()->with('success', 'Network created successfully.');
    }

    public function update(Request $request, $id)
    {
        $network = \App\Models\P2pNetwork::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:p2p_networks,name,' . $id,
            'currency_symbol' => 'required|string|max:10',
            'is_active' => 'boolean',
        ]);

        $network->update($validated);

        return redirect()->back()->with('success', 'Network updated successfully.');
    }

    public function destroy($id)
    {
        $network = \App\Models\P2pNetwork::findOrFail($id);
        $network->delete();

        return redirect()->back()->with('success', 'Network deleted successfully.');
    }
}
