<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    /**
     * Create one category per entry of questions.json.
     *
     * @return void
     */
    public function run()
    {
        foreach (QuestionSeeder::readJson() as $bloc) {
            Categorie::create(['categorie' => $bloc['categorie']]);
        }
    }
}
