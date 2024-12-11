<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;

class FeedbackController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index() {
        return 'Feedback';
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required'
        ]);

        // Create quiz via a user
        $feedback = Feedback::create($fields);

        return $feedback;
    }

    public function show(Feedback $feedback)
    {
        return $feedback;
    }

    public function update(Request $request, Feedback $feedback)
    {
        $fields = $request->validate([
            'question_text' => 'required'
        ]);

        // Create quiz via a user
        $feedback->update($fields);

        return $feedback;
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();
    
        return response()->json(['message' => "Feedback was deleted"], 200);
    }
}
