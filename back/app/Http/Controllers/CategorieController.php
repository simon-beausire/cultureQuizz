<?php

namespace App\Http\Controllers;

use App\Models\Categorie;

class CategorieController extends Controller
{
    /**
     * Number of questions sent for one quiz.
     */
    private const QUESTIONS_PER_QUIZ = 10;

    /**
     * GET /api/categories
     * List all categories.
     */
    public function index()
    {
        return response()->json(
            Categorie::orderBy('id')->get(['id', 'categorie']),
            200,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    /**
     * GET /api/categories/{id}/questions
     * 10 random questions of a category, each with 4 shuffled answers.
     */
    public function questions($id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie introuvable.'], 404, [], JSON_UNESCAPED_UNICODE);
        }

        $questions = $categorie->questions()
            ->inRandomOrder()
            ->limit(self::QUESTIONS_PER_QUIZ)
            ->get()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'answers' => $question->randomAnswers(),
                ];
            });

        return response()->json([
            'categorie' => [
                'id' => $categorie->id,
                'categorie' => $categorie->categorie,
            ],
            'questions' => $questions,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}
