import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper } from '@mui/material';
import { AddItemForm } from 'components/AddItemForm/AddItemForm';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { selectIsLoggedIn } from 'features/Login/auth-reducer';
import {
  addTodolist,
  changeTodolistFilter,
  changeTodolistTitle,
  fetchTodoList,
  FilterValuesType,
  removeTodolist,
  selectTodoLists,
} from 'features/TodolistsList/model/todolists-reducer';
import { removeTask, selectTasks } from 'features/Task/model/tasks-reducer';
import { Todolist } from 'features/TodolistsList/ui/Todolist';

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
                  changeFilter={changeFilter}
                  removeTodolist={removeTodolistCallback}
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
function addTask(arg0: { todolistId: string; title: string }): any {
  throw new Error('Function not implemented.');
}
