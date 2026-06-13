<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAttemptRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'competitor_id' => ['required', 'exists:competitors,id'],
            'type' => ['required', 'in:squat,bench_press,deadlift'],
            'attempt_number' => ['required', 'integer', 'between:1,3'],
            'weight' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:success,failure'],
        ];
    }
}
