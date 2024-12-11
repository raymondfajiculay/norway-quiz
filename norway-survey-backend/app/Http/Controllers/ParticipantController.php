<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParticipantController extends Controller
{
    public function index() {
        return "this";
    }

    public function store(Request $request) {

        $fields = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'nickname' => 'required|max:50',
            'age' => 'required|numeric|between:0,100',
            'number' => 'required|regex:/^09\d{9}$/',
            'biological_sex' => 'required',
            'identification' => 'required'
        ]);        

        $data = Participant::create($fields);

        return $data;
    }

    public function checkNumber(Request $request)
    {
        $request->validate([
            'number' => 'required|numeric',
            'quiz_id' => 'required|integer'
        ]);
    
        $exists = Participant::where('number', $request->number)
            ->where('quiz_id', $request->quiz_id)
            ->exists();
    
        return response()->json([
            'message' => $exists
        ], 200);
    }
    
}
