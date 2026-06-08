<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'status' => true,
        ]);

        User::create([
            'name' => 'Mesa',
            'email' => 'mesa@gmail.com',
            'password' => Hash::make('mesa123'),
            'rol' => 'mesa',
            'status' => true,
        ]);

        User::create([
            'name' => 'Juez',
            'email' => 'juez@gmail.com',
            'password' => Hash::make('juez123'),
            'rol' => 'juez',
            'status' => true,
        ]);
    }
}
