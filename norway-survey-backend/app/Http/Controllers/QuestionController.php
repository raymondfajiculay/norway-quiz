<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class QuestionController extends Controller implements HasMiddleware
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
        return Question::with('quiz')->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $fields = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required|max:200',
            'answer' => 'required|max:4',
            'test_type' => 'required',
            'explanation' => 'required|max:500'
        ]);

        // Create questions via a quiz
        $question = Question::create($fields);

        return $question;
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        return $question;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        $fields = $request->validate([
           'question_text' => 'required',
            'answer' => 'required|max:4',
            'explanation' => 'required|max:500'
        ]);

        $question->update($fields);

        return $question;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {   
        $question->delete();

        return ['message' => "Question was deleted"];
    }
}
