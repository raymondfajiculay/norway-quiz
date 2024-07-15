<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'participant_id',
        'answer'
    ];

    public function participant() {
        return $this->belongsTo(Participant::class);
    }
}
