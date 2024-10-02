import { Task } from 'features/Task/ui/Task';
import React from 'react';
import { TaskStatuses, TaskType } from 'features/Task/api/tasksApi.types';
import { FilterValuesType } from 'features/TodolistsList/model/todolists-reducer';

type Props = {
  tasks: TaskType[];
  todoId: string;
  filter: FilterValuesType;
};

export const Tasks = ({ tasks, todoId, filter }: Props) => {
  if (filter === 'active') {
    tasks = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (filter === 'completed') {
    tasks = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <>
      {tasks.map((t) => (
        <Task
          key={t.id}
          task={t}
          todolistId={todoId}
        />
      ))}
    </>
  );
};
