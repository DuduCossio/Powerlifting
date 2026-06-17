<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'], 
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return match (Auth::user()->rol) {
                'admin' => redirect()->route('admin.dashboard.index'),
                'juez' => redirect()->route('judge.votes.create'),
                'mesa' => redirect()->route('desk.competitors.create'),
                default => redirect()->intended('/'), 
            };
        }

        return back()->withErrors([
            'email' => 'Las credenciales no coinciden.',
        ]);
    }
    
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
