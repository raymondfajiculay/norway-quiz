<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_text',
        'right_answer',
        'explanation'
    ];

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }
}
