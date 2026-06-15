<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\IndexTaskRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Services\TaskService;

class TaskController extends Controller
{
    //
    public function __construct(
        protected TaskService $taskService
        )
    { }

    public function index(IndexTaskRequest $request)
    {
        $request_data = $request->all();

        $result = $this->taskService->index($request_data['filter'] ?? null);
        return response()->json($result);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::create($request->only('description', 'completed'));

        return response()->json([
            'task' => $task
        ], 201);
    }

    public function show(Task $task)
    {
        return response()->json([
            'task' => $task
        ]);
    }

    public function update(StoreTaskRequest $request, Task $task)
    {
        $task->update($request->only('description', 'completed'));

        return response()->json([
            'task' => $task
        ]);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, 204);
    }

    public function toggle($taskId)
    {
        $task = $this->taskService->toggleTaskCompletion($taskId);

        return response()->json([
            'task' => $task
        ]);
    }
}
