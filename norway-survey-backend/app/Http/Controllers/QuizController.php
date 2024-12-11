<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class QuizController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Quiz::with('user')->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'slug' => 'required|max:50|unique:quizzes,slug',
            'title' => 'required|max:50',
            'description' => 'required|max:500',
            'status' => 'required|max:6'
        ]);

        // Create quiz via a user
        $quiz = $request->user()->quiz()->create($fields);

        return ['quiz' => $quiz, 'user' => $quiz->user];
    }

    /**
     * Display the specified resource.
     */
    public function show(Quiz $quiz)
    {
        $quiz->load(['questions', 'interventions']);
        return [
            'quiz' => $quiz,
            'questions' => $quiz->questions,
            'interventions' => $quiz->interventions,
            'attitude' => $quiz->attitude,
            'feedback' => $quiz->feedback,
            'user' => $quiz->user
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quiz $quiz)
    {
        Gate::authorize('modify', $quiz);

        $fields = $request->validate([
            'slug' => 'required|max:50',
            'title' => 'required|max:50',
            'description' => 'required|max:500',
            'status' => 'required|max:6'
        ]);

        $quiz->update($fields);

        return $quiz;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quiz $quiz)
    {   
        Gate::authorize('modify', $quiz);

        $quiz->delete();

        return ['message' => "quiz was deleted"];
    }
}
