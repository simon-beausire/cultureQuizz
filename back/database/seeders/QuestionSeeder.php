<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;
use RuntimeException;

class QuestionSeeder extends Seeder
{
    /**
     * Insert every question of questions.json.
     * The first answer of "reponses" is the correct one and goes into reponse1.
     *
     * @return void
     */
    public function run()
    {
        foreach (self::readJson() as $bloc) {
            foreach ($bloc['questions'] as $item) {
                $reponses = $item['reponses'] ?? [];

                // Each question must have exactly 10 different answers
                if (count($reponses) !== 10 || count(array_unique($reponses)) !== 10) {
                    throw new RuntimeException(
                        "La question « {$item['question']} » doit avoir exactement 10 réponses différentes."
                    );
                }

                $data = [
                    'categorie' => $bloc['categorie'],
                    'question' => $item['question'],
                ];
                foreach ($reponses as $index => $reponse) {
                    $data['reponse' . ($index + 1)] = $reponse;
                }

                Question::create($data);
            }
        }
    }

    /**
     * Read and decode database/seeders/questions.json.
     *
     * @return array
     */
    public static function readJson()
    {
        $path = database_path('seeders/questions.json');
        $json = json_decode(file_get_contents($path), true);

        if (!is_array($json) || !isset($json['categories'])) {
            throw new RuntimeException('Le fichier questions.json est invalide : ' . json_last_error_msg());
        }

        return $json['categories'];
    }
}
