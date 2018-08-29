<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use \Symfony\Component\HttpKernel\Exception\HttpException;
use Dingo\Api\Routing\Helpers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTask;
use App\Http\Requests\StoreFile;
use App\Http\Requests\SearchRequest;
use App\Task;

use Storage;

/**
 * @Resource("Tasks")
 */
class TaskController extends Controller
{
    use Helpers;

    private $fileTypes = array(
        'pdf', 'xml', 'jpg'
    );

    /**
     * Get tasks
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @Get("/tasks}")
     * @Versions({"v1"})
     * @Request(headers={
     *     "Authorization": "Bearer {token}"
     * })
     * @Response(200, body={})
     */
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $tasks = Task::where('user_id', $user->id)
                    ->orderBy('is_finished', 'asc')
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($tasks, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  StoreTask  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTask $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $task = new Task();
        $task->fill($request->input());
        $task->user_id = $user->id;
        $task->save();

        return response()->json(['success' => true], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $task = Task::find($id)->first();

        if (!$task || $task->user_id !== $user->id)
            throw new Exception(400, "Task not found!");

        return response()->json($task, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  StoreTask  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreTask $request, $id)
    {
        $task = Task::find($id);

        if (!$task)
            throw new Exception(400, "Task not found!");

        $task->fill($request->input());
        $task->update();

        return response()->json(['success' => true], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task)
            throw new HttpException(400, "Task not found!");
        
        $task->delete();

        return response()->json(['success' => true], 200);    
    }

    /**
     * Search tasks.
     *
     * @param  SearchRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function searchTask(SearchRequest $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $data = $request->input('search');

        $tasks = Task::where('title', 'like', '%'.$data.'%')
                    ->orWhere('description', 'like', '%'.$data.'%')
                    ->get();

        return response()->json($tasks, 200);
    }

    /**
     * File upload
     * 
     * @param  StoreFile  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function fileUpload(StoreFile $request, $id)
    {
        $file = $request->file('file');
        $fileType = $file->getClientOriginalExtension();
        $fileName = $file->getClientOriginalName();
        $fileSize = $file->getClientSize();
        $name = $fileName . '.' . $fileType;

        if ($fileSize >= 5000000)
            throw new HttpException(400, "File size is too large!");
        
        if (in_array($fileType, $this->fileTypes)) {
            $upload = Storage::disk('local')
                ->put('files/' . $name, fopen($file->getRealPath(), 'r+'));

            $task = Task::find($id);
            $task->file = 'files/' . $name;
            $task->update();
        } else {
            throw new HttpException(400, "File extension is not allowed!");
        }
        
        return response()->json(['success' => true], 200);
    }
}
