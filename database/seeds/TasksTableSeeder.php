<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tasks')->insert([
            "id"            => "1",
            "user_id"       => "1",
            "title"         => "First Task",
            "description"   => "Test description",
            "created_at"    => Carbon::now()
        ]);
        DB::table('tasks')->insert([
            "id"            => "2",
            "user_id"       => "1",
            "title"         => "Second Task",
            "description"   => "Test description",
            "is_finished"   => true,
            "created_at"    => Carbon::now()
        ]);
    }
}
