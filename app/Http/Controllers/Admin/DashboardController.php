<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documentation;
use App\Models\Feature;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'documentations' => Documentation::query()->count(),
                'features' => Feature::query()->count(),
                'testimonials' => Testimonial::query()->count(),
            ],
        ]);
    }
}
