<?php

namespace App\Policies;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Auth\Access\Response;

class QuizPolicy
{
    public function modify(Quiz $quiz, Question $question): Response
    {
        return $quiz->id === $question->question_id
            ? Response::allow()
            : Response::deny('You do not own this question');
    }
}
