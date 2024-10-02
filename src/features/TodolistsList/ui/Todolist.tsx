import React, { useEffect } from 'react';
import { AddItemForm } from 'components/AddItemForm/AddItemForm';
import { EditableSpan } from 'components/EditableSpan/EditableSpan';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  changeTodolistTitle,
  removeTodolist,
  TodolistDomainType,
} from 'features/TodolistsList/model/todolists-reducer';
import { TaskStatuses, TaskType } from 'features/Task/api/tasksApi.types';
import { addTask, fetchTasks } from 'features/Task/model/tasks-reducer';
import { Task } from 'features/Task/ui/Task';
import { FilterTaskButtons } from 'features/TodolistsList/filterTaskButtons/FilterTaskButtons';
import { Tasks } from 'features/TodolistsList/tasks/Tasks';

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

  const removeTodolistCallback = () =>
    dispatch(removeTodolist({ todolistId: props.todolist.id }));

  const changeTodolistTitleCallback = (title: string) =>
    dispatch(changeTodolistTitle({ id: props.todolist.id, title }));

  let tasksForTodolist = props.tasks;

  return (
    <div>
      <h3>
        <EditableSpan
          value={props.todolist.title}
          onChange={changeTodolistTitleCallback}
        />
        <IconButton
          onClick={removeTodolistCallback}
          disabled={props.todolist.entityStatus === 'loading'}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm
        addItem={addTaskCallback}
        disabled={props.todolist.entityStatus === 'loading'}
      />
      <div>
        <Tasks
          tasks={tasksForTodolist}
          todoId={props.todolist.id}
          filter={props.todolist.filter}
        />
      </div>
      <div style={{ paddingTop: '10px' }}>
        <FilterTaskButtons
          todoId={props.todolist.id}
          filter={props.todolist.filter}
        />
      </div>
    </div>
  );
};
