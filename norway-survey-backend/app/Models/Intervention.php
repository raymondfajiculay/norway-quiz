<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'link',
        'start_time'
    ];

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }
}
