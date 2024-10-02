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

  const changeTaskFilter = (filter: FilterValuesType) => {
    dispatch(changeTodolistFilter({ id: todoId, filter }));
  };

  return (
    <>
      <Button
        variant={filter === 'all' ? 'outlined' : 'text'}
        onClick={() => changeTaskFilter('all')}
        color={'inherit'}
      >
        All
      </Button>
      <Button
        variant={filter === 'active' ? 'outlined' : 'text'}
        onClick={() => changeTaskFilter('active')}
        color={'primary'}
      >
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'outlined' : 'text'}
        onClick={() => changeTaskFilter('completed')}
        color={'secondary'}
      >
        Completed
      </Button>
    </>
  );
};
