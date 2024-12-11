<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'status'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function questions() {
        return $this->hasMany(Question::class);
    }

    public function interventions() {
        return $this->hasMany(Intervention::class);
    }

    public function attitude() {
        return $this->hasMany(Attitude::class);
    }

    public function feedback() {
        return $this->hasMany(Feedback::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }
}
