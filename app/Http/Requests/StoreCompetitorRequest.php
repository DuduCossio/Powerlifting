<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCompetitorRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'sexo' => ['required', 'string'],
            'body_weight' => ['required', 'numeric', 'min:0'],
            'age' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'division_id' => ['required', 'exists:divisions,id'],
            'group_id' => ['nullable', 'exists:groups,id'],

            'attempts' => ['array'],
            'attempts.*.type' => ['required_with:attempts', 'in:squat,bench_press,deadlift'],
            'attempts.*.attempt_number' => ['required_with:attempts', 'integer', 'between:1,3'],
            'attempts.*.weight' => ['required_with:attempts', 'numeric', 'min:0'],
            'attempts.*.status' => ['required_with:attempts', 'in:success,failure']
        ];
    }
}
