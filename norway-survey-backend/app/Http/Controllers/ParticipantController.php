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
            'quiz_id' => 'required|integer' // Ensure quiz_id is also provided
        ]);

        // Check if the number exists in the participants table
        $exists = Participant::where('number', $request->number)->exists();

        // Check if the participant has existing answers for any questions in the given quiz ID
        $hasExistingAnswers = DB::table('participants')
            ->join('answers', 'participants.id', '=', 'answers.participant_id')
            ->join('questions', 'answers.question_id', '=', 'questions.id')
            ->where('participants.number', $request->number)
            ->where('questions.quiz_id', $request->quiz_id)
            ->exists();

        return response()->json([
            'exists' => $exists,
            'hasExistingAnswers' => $hasExistingAnswers
        ]);
    }

}
