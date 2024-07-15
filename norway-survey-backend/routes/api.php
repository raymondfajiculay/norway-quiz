<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InterventionController;
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
Route::apiResource('participants', ParticipantController::class);
Route::apiResource('questions', QuestionController::class);
Route::apiResource('answers', AnswerController::class);

Route::get('/quizzes/{quiz}/questions', [QuizController::class, 'getQuestionsByQuiz']);
Route::get('/quizzes/{quiz}/interventions', [QuizController::class, 'getInterventionsByQuiz']);
Route::get('/quizzes/{quiz}/questions', [QuizController::class, 'showQuestions']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');