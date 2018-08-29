<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            "id"         => "1",
            "first_name" => "test",
            "last_name"  => "user",
            "email"      => "testuser@test.com",
            "password"   => bcrypt('secret')
        ]);
    }
}
