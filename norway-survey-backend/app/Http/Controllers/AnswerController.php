<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    public function index() {
        return "this";
    }

    public function store(Request $request) {
        $fields = $request->validate([
            'question_id' => 'required',
            'participant_id' => 'required',
            'answer' => 'required'
        ]);

        $data = Answer::create($fields);

        return $data;
    }
}
