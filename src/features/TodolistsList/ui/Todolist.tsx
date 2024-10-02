import React, { useEffect } from 'react';
import { AddItemForm } from 'components/AddItemForm/AddItemForm';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { TodolistDomainType } from 'features/TodolistsList/model/todolists-reducer';
import { TaskType } from 'features/Task/api/tasksApi.types';
import { addTask, fetchTasks } from 'features/Task/model/tasks-reducer';
import { FilterTaskButtons } from 'features/TodolistsList/filterTaskButtons/FilterTaskButtons';
import { Tasks } from 'features/TodolistsList/tasks/Tasks';
import { TodoListTitle } from 'features/TodolistsList/todoListTitle/TodoListTitle';

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = ({ demo = false, ...props }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) {
      return;
    }
    dispatch(fetchTasks(props.todolist.id));
  }, []);

  const addTaskCallback = (title: string) => {
    dispatch(addTask({ todolistId: props.todolist.id, title: title }));
  };

  let tasksForTodolist = props.tasks;

  return (
    <>
      <TodoListTitle todolist={props.todolist} />
      <AddItemForm
        addItem={addTaskCallback}
        disabled={props.todolist.entityStatus === 'loading'}
      />
      <Tasks
        tasks={tasksForTodolist}
        todoId={props.todolist.id}
        filter={props.todolist.filter}
      />
      <div style={{ paddingTop: '10px' }}>
        <FilterTaskButtons
          todoId={props.todolist.id}
          filter={props.todolist.filter}
        />
      </div>
    </>
  );
};
