<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function index() {
        return "this";
    }

    public function store(Request $request) {

        $fields = $request->validate([
            'nickname' => 'required|max:50',
            'age' => 'required:max:2',
            'number' => 'required',
            'biological_sex' => 'required',
            'identification' => 'required'
        ]);

        $data = Participant::create($fields);

        return $data;
    }
}
