<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'nickname',
        'age',
        'number',
        'biological_sex',
        'identification',
    ];

    public function answer() {
        return $this->hasMany(Answer::class);
    }
}
