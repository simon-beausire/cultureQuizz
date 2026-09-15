<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';

    // The table has no created_at / updated_at columns
    public $timestamps = false;

    protected $fillable = [
        'categorie', 'question',
        'reponse1', 'reponse2', 'reponse3', 'reponse4', 'reponse5',
        'reponse6', 'reponse7', 'reponse8', 'reponse9', 'reponse10',
    ];

    /**
     * Pick 4 answers: the correct one (reponse1) + 3 random wrong ones, then shuffle.
     *
     * @return array<int, array{id: int, text: string, isCorrect: bool}>
     */
    public function randomAnswers()
    {
        // Answer id = its column number (1 to 10)
        $wrongIds = collect(range(2, 10))->shuffle()->take(3);

        return $wrongIds->prepend(1)
            ->shuffle()
            ->map(function ($i) {
                return [
                    'id' => $i,
                    'text' => $this->{'reponse' . $i},
                    'isCorrect' => $i === 1,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Relation to the category, using the category name as key.
     */
    public function categorieModel()
    {
        return $this->belongsTo(Categorie::class, 'categorie', 'categorie');
    }
}
