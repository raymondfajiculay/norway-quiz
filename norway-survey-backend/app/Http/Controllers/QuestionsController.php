<?php

namespace App\Http\Controllers;

use App\Models\Questions;
use Illuminate\Http\Request;

use function PHPSTORM_META\map;

class QuestionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Questions::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'question_text' => 'required|max:50',
            'rigth_answer' => 'required|max:5',
            'explanation' => 'required|max:500'
        ]);

        // Create questions via a user
        $question = $request->quiz()->questions()->create($fields);

        return $question;
    }

    /**
     * Display the specified resource.
     */
    public function show(Questions $question)
    {
        return $question;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Questions $question)
    {

        $fields = $request->validate([
           'question_text' => 'required|max:50',
            'rigth_answer' => 'required|max:5',
            'explanation' => 'required|max:500'
        ]);

        $question->update($fields);

        return $question;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Questions $question)
    {   
        $question->delete();

        return ['message' => "Question was deleted"];
    }
}
