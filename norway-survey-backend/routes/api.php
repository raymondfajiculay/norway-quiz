<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InterventionController;
use App\Http\Controllers\AttitudeController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Models\Participant;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class);
Route::apiResource('quizzes', QuizController::class);
Route::apiResource('interventions', InterventionController::class);
Route::apiResource('attitude', AttitudeController::class);
Route::apiResource('feedback', FeedbackController::class);
Route::apiResource('participants', ParticipantController::class);
Route::apiResource('questions', QuestionController::class);
Route::apiResource('answers', AnswerController::class);

Route::get('/dashboard/{slug}', [AnswerController::class, 'dashboard']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/check-number', [ParticipantController::class, 'checkNumber']);