<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowTaskRequest extends FormRequest
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
            'id' => ['required', 'integer', 'exists:tasks,id'],
            'description' => ['sometimes', 'string', 'max:255'],
            'completed' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'A task ID is required.',
            'id.integer' => 'The task ID must be an integer.',
            'id.exists' => 'The specified task does not exist.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 255 characters.',
            'completed.boolean' => 'The completed field must be true or false.',
        ];
    }
}
