import { Button } from '@mui/material';
import React from 'react';
import {
  changeTodolistFilter,
  FilterValuesType,
} from 'features/TodolistsList/model/todolists-reducer';
import { useAppDispatch } from 'hooks/useAppDispatch';

type Props = {
  todoId: string;
  filter: FilterValuesType;
};

export const FilterTaskButtons = ({ todoId, filter }: Props) => {
  const dispatch = useAppDispatch();

  const changeOnAllFilterCallback = () =>
    dispatch(changeTodolistFilter({ id: todoId, filter: 'all' }));

  const changeOnActiveFilterCallback = () =>
    dispatch(changeTodolistFilter({ id: todoId, filter: 'active' }));

  const changeOnCompletedFilterCallback = () =>
    dispatch(changeTodolistFilter({ id: todoId, filter: 'completed' }));
  return (
    <>
      <Button
        variant={filter === 'all' ? 'outlined' : 'text'}
        onClick={changeOnAllFilterCallback}
        color={'inherit'}
      >
        All
      </Button>
      <Button
        variant={filter === 'active' ? 'outlined' : 'text'}
        onClick={changeOnActiveFilterCallback}
        color={'primary'}
      >
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'outlined' : 'text'}
        onClick={changeOnCompletedFilterCallback}
        color={'secondary'}
      >
        Completed
      </Button>
    </>
  );
};
