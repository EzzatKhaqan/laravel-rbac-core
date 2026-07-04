<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post("/auth/login", [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {

    // AuthRoutes
    Route::prefix('auth')->group(function () {
        Route::apiResource("/roles", RoleController::class);
        Route::apiResource("/permissions", PermissionController::class);
        Route::get("/profile", [AuthController::class, 'getProfile']);
        Route::get("/abilities", [AuthController::class, 'abilities']);
        Route::get("/check", [AuthController::class, 'validateToken']);
        Route::post("/logout", [AuthController::class, 'logout']);
    });

    //User
    Route::apiResource('/users', UserController::class);

});