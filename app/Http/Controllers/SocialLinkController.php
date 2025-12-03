<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SocialLinkController extends Controller
{
    public function index()
    {
        $links = \App\Models\SocialLink::all();
        return \Inertia\Inertia::render('admin/settings/social-links', [
            'links' => $links
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url',
            'icon' => 'required|string',
        ]);

        \App\Models\SocialLink::create($request->all());

        return back()->with('success', 'Social link created successfully.');
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $link = \App\Models\SocialLink::findOrFail($id);
        
        $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url',
            'icon' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $link->update($request->all());

        return back()->with('success', 'Social link updated successfully.');
    }

    public function destroy($id)
    {
        \App\Models\SocialLink::findOrFail($id)->delete();
        return back()->with('success', 'Social link deleted successfully.');
    }
}
