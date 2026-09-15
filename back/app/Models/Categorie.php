<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $table = 'categories';

    // The table has no created_at / updated_at columns
    public $timestamps = false;

    protected $fillable = ['categorie'];

    /**
     * Questions of this category (joined on the category name).
     */
    public function questions()
    {
        return $this->hasMany(Question::class, 'categorie', 'categorie');
    }
}
