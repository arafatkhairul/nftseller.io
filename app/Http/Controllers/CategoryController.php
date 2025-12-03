<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = \App\Models\Category::latest()->get();
        return \Inertia\Inertia::render('admin/categories/index', [
            'categories' => $categories
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        \App\Models\Category::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $category = \App\Models\Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy($id)
    {
        \App\Models\Category::findOrFail($id)->delete();
        return back()->with('success', 'Category deleted successfully.');
    }
}
