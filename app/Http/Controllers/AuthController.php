<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Dingo\Api\Routing\Helpers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\User;

/**
 * @Resource("Authentication")
 */
class AuthController extends Controller
{
    use Helpers;

    /**
     * The attribute that aren't mass assignable.
     *
     * @var string $jwt
     */
    protected $jwt;

    /**
     * Create a new controller instance.
     *
     * @param JWTAuth $jwt
     * @return void
     */
    public function __construct(JWTAuth $jwt) {
        $this->jwt = $jwt;
    }

    /**
     * Login
     * @param LoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @Post("/login}")
     * @Versions({"v1"})
     * @Parameters({
     *     @Parameter("email", description="Email", type="string"),
     *     @Parameter("password", description="Password", type="string"),
     * })
     * @Request({
     *      "email": "test@test.com",
     *      "password": "asdqwe123"
     * },headers={
     *     "Authorization": "Bearer {token}"
     * })
     * @Response(200, body={
     *     "token": "token_string"
     * })
     */
    public function login(LoginRequest $request) {
        $credentials = $request->only('email', 'password');
        $token = null;

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'Invalid email or password!'
                ], 422);
            }
        } catch (JWTAuthException $e) {
            return response()->json([
                'Failed to create token!'
            ], 500);
        }
        return response()->json(compact('token'));
    }
    
    /**
     * Signup
     * @param SignupRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @Post("/signup}")
     * @Versions({"v1"})
     * @Parameters({
     *     @Parameter("first_name", description="Firstname", type="string"),
     *     @Parameter("last_name", description="Lastname", type="string"),
     *     @Parameter("email", description="Email", type="string"),
     *     @Parameter("password", description="Password", type="string"),
     *     @Parameter("password_confirmation", description="Password check", type="string"),
     * })
     * @Request({
     *      "first_name": "John",
     *      "last_name": "Doe",
     *      "email": "test@test.com",
     *      "password": "asdqwe123"
     *      "password_confirmation": "asdqwe123"
     * },headers={
     *     "Authorization": "Bearer {token}"
     * })
     * @Response(200, body={
     *     "token": "token_string"
     * })
     */
    public function signup(SignupRequest $request) {
        $data = $request->only('first_name', 'last_name', 'email', 'password', 'password_confirmation');
        $credentials = $request->only('email', 'password');
        $token = null;

        $user = User::where('email', '=', $data['email'])->first();

        if (!$user) {
            $user = new User();
            $user->fill($request->input());
            $user->password = bcrypt($data['password']);
            $user->save();
            
            $token = JWTAuth::attempt($credentials);
            return response()->json(compact('token'));
        } else {
            return response()->json([
                'This email address is already exists!'
            ], 500);
        }
    }

    /**
     * Logout
     *
     * @return \Dingo\Api\Http\Response
     * @Get("/logout")
     * @Versions({"v1"})
     * @Request(headers={
     *     "Authorization": "Bearer {token}"
     * })
     * @Response(200, body={
     *     "success": "true"
     * })
     */
    public function logout() {
        $token = JWTAuth::getToken();

        if (JWTAuth::invalidate($token)) {
            return response()->json([
                'success' => true
            ], 200);
        } else {
            return response()->json([
                'Failed to logout user. Try again.'
            ], 500);
        }
    }
}
