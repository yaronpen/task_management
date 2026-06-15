<?php

namespace App\Http\Services;

use App\Models\Task;

class TaskService
{
    public function index($filter = null)
    {

        return Task::when($filter, function ($query) use ($filter) {
            if($filter === 'all' || $filter === null) {
                return $query;
            }
            else if ($filter === 'completed') {
                $query->where('completed', true);
            } elseif ($filter === 'pending') {
                $query->where('completed', false);
            }
        })->get();
    }

    public function store($data)
    {
        return Task::create($data);
    }

    public function toggleTaskCompletion($taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->completed = !$task->completed;
        $task->save();

        return $task;
    }
}