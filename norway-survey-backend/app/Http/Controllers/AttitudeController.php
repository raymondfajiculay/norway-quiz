<?php

namespace App\Http\Controllers;

use App\Models\Attitude;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AttitudeController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index() {
        return 'Attitude';
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required'
        ]);

        // Create quiz via a user
        $attitude = Attitude::create($fields);

        return $attitude;
    }

    public function show(Attitude $attitude)
    {
        return $attitude;
    }

    public function update(Request $request, Attitude $attitude)
    {
        $fields = $request->validate([
            'question_text' => 'required'
        ]);

        // Create quiz via a user
        $attitude->update($fields);

        return $attitude;
    }

    public function destroy(Attitude $attitude)
    {
        $attitude->delete();
    
        return response()->json(['message' => "Attitude was deleted"], 200);
    }
}
