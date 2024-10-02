import { EditableSpan } from 'components/EditableSpan/EditableSpan';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import React from 'react';
import {
  changeTodolistTitle,
  removeTodolist,
  TodolistDomainType,
} from 'features/TodolistsList/model/todolists-reducer';
import { useAppDispatch } from 'hooks/useAppDispatch';

type Props = {
  todolist: TodolistDomainType;
};

export const TodoListTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();

  const removeTodolistCallback = () =>
    dispatch(removeTodolist({ todolistId: todolist.id }));

  const changeTodolistTitleCallback = (title: string) =>
    dispatch(changeTodolistTitle({ id: todolist.id, title }));

  return (
    <>
      <h3>
        <EditableSpan
          value={todolist.title}
          onChange={changeTodolistTitleCallback}
        />
        <IconButton
          onClick={removeTodolistCallback}
          disabled={todolist.entityStatus === 'loading'}
        >
          <Delete />
        </IconButton>
      </h3>
    </>
  );
};
