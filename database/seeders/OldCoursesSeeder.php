<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Program;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Testing\Fakes\Fake;
use Faker\Factory as Faker;

class OldCoursesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $programs = Program::all();

        if ($programs->isEmpty()) {
            $this->command->info('No programs found, skipping OldCoursesSeeder.');
            return;
        }

        for ($i = 0; $i < 30; $i++) {
            Course::create([
                'name' => $faker->bs(),
                'code' => $faker->unique()->bothify('??-###'),
                'description' => $faker->sentence(),
                'program_id' => $programs->random()->id,
                'created_at' => Carbon::now()->subYears(rand(0, 5))->subDays(rand(0, 365)),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
