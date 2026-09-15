<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // Categories first, because questions reference them by name
        $this->call([
            CategorieSeeder::class,
            QuestionSeeder::class,
        ]);
    }
}
