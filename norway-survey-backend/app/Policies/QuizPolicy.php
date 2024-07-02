<?php

namespace App\Policies;

use App\Models\Quiz;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class QuizPolicy
{
    public function modify(User $user, Quiz $quiz): Response
    {
        return $user->id === $quiz->user_id
            ? Response::allow()
            : Response::deny('You do not own this quiz');
    }
}
