<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attitude extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text'
    ];

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }
}
