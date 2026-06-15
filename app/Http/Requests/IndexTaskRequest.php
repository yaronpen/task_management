<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexTaskRequest extends FormRequest
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
            'filter' => ['sometimes', 'string', 'in:all,completed,pending']
        ];
    }

    public function messages(): array
    {
        return [
            'filter.string' => 'The filter must be a string.',
            'filter.in' => 'The filter must be one of the following: all, completed, pending.',
        ];
    }
}
