<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DocumentationController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\MimiController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/locale/{locale}', [PageController::class, 'setLocale'])
    ->whereIn('locale', ['en', 'id'])
    ->name('locale.set');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
});

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('hero', [HeroController::class, 'edit'])->name('hero.edit');
    Route::post('hero', [HeroController::class, 'update'])->name('hero.update');

    Route::resource('documentations', DocumentationController::class)->except('show');
    Route::resource('features', FeatureController::class)->except('show');
    Route::resource('testimonials', TestimonialController::class)->except('show');

    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Mimi assistant API
    Route::get('mimi/stats', [MimiController::class, 'stats'])->name('mimi.stats');
    Route::get('mimi/query', [MimiController::class, 'query'])->name('mimi.query');
});
