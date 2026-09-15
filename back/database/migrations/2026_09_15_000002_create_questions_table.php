<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            // Category NAME (not id), linked to categories.categorie
            $table->string('categorie');
            $table->string('question');
            // reponse1 is ALWAYS the correct answer, reponse2..reponse10 are wrong answers
            for ($i = 1; $i <= 10; $i++) {
                $table->string('reponse' . $i);
            }

            $table->foreign('categorie')
                ->references('categorie')
                ->on('categories')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
