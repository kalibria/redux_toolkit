import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  addTodolist,
  changeTodolistFilter,
  changeTodolistTitle,
  fetchTodoList,
  FilterValuesType,
  removeTodolist,
  selectTodoLists,
} from './todolists-reducer';
import { removeTask, selectTasks, updateTask } from './tasks-reducer';
import { TaskStatuses } from 'api/todolists-api';
import { Grid, Paper } from '@mui/material';
import { AddItemForm } from 'components/AddItemForm/AddItemForm';
import { Todolist } from './Todolist/Todolist';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { selectIsLoggedIn } from 'features/Login/auth-reducer';
import { addTask } from './tasks-reducer';

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodoLists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }

    dispatch(fetchTodoList());
  }, []);

  const removeTaskCallback = useCallback(function (
    taskId: string,
    todolistId: string
  ) {
    dispatch(removeTask({ taskId, todolistId }));
  }, []);

  const addTaskCallback = useCallback(function (
    title: string,
    todolistId: string
  ) {
    dispatch(addTask({ todolistId, title }));
  }, []);

  const changeStatus = useCallback(function (
    taskId: string,
    status: TaskStatuses,
    todolistId: string
  ) {
    dispatch(updateTask({ taskId, model: { status }, todolistId }));
  }, []);

  const changeTaskTitle = useCallback(function (
    taskId: string,
    title: string,
    todolistId: string
  ) {
    dispatch(updateTask({ taskId, model: { title }, todolistId }));
  }, []);

  const changeFilter = useCallback(function (
    value: FilterValuesType,
    todolistId: string
  ) {
    const action = changeTodolistFilter({ id: todolistId, filter: value });
    dispatch(action);
  }, []);

  const removeTodolistCallback = useCallback(function (todolistId: string) {
    dispatch(removeTodolist({ todolistId }));
  }, []);

  const changeTodolistTitleCallback = useCallback(function (
    id: string,
    title: string
  ) {
    dispatch(changeTodolistTitle({ id, title }));
  }, []);

  const addTodolistCallback = useCallback(
    (title: string) => {
      dispatch(addTodolist(title));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />;
  }

  return (
    <>
      <Grid
        container
        style={{ padding: '20px' }}
      >
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid
        container
        spacing={3}
      >
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid
              item
              key={tl.id}
            >
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTaskCallback}
                  changeFilter={changeFilter}
                  addTask={addTaskCallback}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolistCallback}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitleCallback}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
