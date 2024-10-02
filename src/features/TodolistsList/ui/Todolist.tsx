import React, { useCallback, useEffect } from 'react';
import { AddItemForm } from 'components/AddItemForm/AddItemForm';
import { EditableSpan } from 'components/EditableSpan/EditableSpan';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  changeTodolistFilter,
  changeTodolistTitle,
  FilterValuesType,
  removeTodolist,
  TodolistDomainType,
} from 'features/TodolistsList/model/todolists-reducer';
import { TaskStatuses, TaskType } from 'features/Task/api/tasksApi.types';
import { addTask, fetchTasks } from 'features/Task/model/tasks-reducer';
import { Task } from 'features/Task/ui/Task';

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

  const changeOnAllFilterCallback = () =>
    dispatch(changeTodolistFilter({ id: props.todolist.id, filter: 'all' }));

  const changeOnActiveFilterCallback = () =>
    dispatch(changeTodolistFilter({ id: props.todolist.id, filter: 'active' }));

  const changeOnCompletedFilterCallback = () =>
    dispatch(
      changeTodolistFilter({ id: props.todolist.id, filter: 'completed' })
    );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(
      (t) => t.status === TaskStatuses.Completed
    );
  }

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
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
          />
        ))}
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Button
          variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
          onClick={changeOnAllFilterCallback}
          color={'inherit'}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
          onClick={changeOnActiveFilterCallback}
          color={'primary'}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
          onClick={changeOnCompletedFilterCallback}
          color={'secondary'}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
