<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    public function store(Request $request) {
        $fields = $request->validate([
            'participant_id' => 'required',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required',
            'answers.*.answer' => 'required',
            'answers.*.test_type' => 'required'
        ]);

        $participant_id = $fields['participant_id'];
        $answers = $fields['answers'];

        foreach ($answers as $answerData) {
            Answer::create([
                'participant_id' => $participant_id,
                'question_id' => $answerData['question_id'],
                'answer' => $answerData['answer'],
                'test_type' => $answerData['test_type']
            ]);
        }

        return response()->json(['message' => 'Answers saved successfully'], 201);
    }
}
