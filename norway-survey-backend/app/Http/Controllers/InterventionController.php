<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class InterventionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index() {
        return 'Interventions';
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'link' => 'required',
            'start_time' => 'required'
        ]);

        // Create quiz via a user
        $intervention = Intervention::create($fields);

        return $intervention;
    }

    public function show(Intervention $intervention)
    {
        return $intervention;
    }

    public function update(Request $request, Intervention $intervention)
    {
        $fields = $request->validate([
            'link' => 'required',
            'start_time' => 'required'
        ]);

        // Create quiz via a user
        $intervention->update($fields);

        return $intervention;
    }

    public function destroy(Intervention $intervention)
    {
        $intervention->delete();
    
        return response()->json(['message' => "Intervention was deleted"], 200);
    }
    
}
