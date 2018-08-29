<?php

namespace App\Http\Requests;

class SignupRequest extends Request
{

    /**
     * Get the validation rules that apply to the request.
     * @return array
     */
    public function rules()
    {
        return [
            'first_name'        => 'string|required',
            'last_name'         => 'string|required',
            'email'             => 'email|required',
            'password'          => 'string|confirmed|min:8'
        ];
    }
}
