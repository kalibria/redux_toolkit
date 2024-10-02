import React, { ChangeEvent, useCallback } from 'react';
import { Checkbox, IconButton } from '@mui/material';
import { EditableSpan } from 'components/EditableSpan/EditableSpan';
import { Delete } from '@mui/icons-material';
import { TaskStatuses, TaskType } from 'features/Task/api/tasksApi.types';
import { removeTask, updateTask } from 'features/Task/model/tasks-reducer';
import { useAppDispatch } from 'hooks/useAppDispatch';

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};
export const Task = (props: TaskPropsType) => {
  const dispatch = useAppDispatch();

  const removeTaskHandler = () =>
    dispatch(
      removeTask({ taskId: props.task.id, todolistId: props.todolistId })
    );

  const updateTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked;
    dispatch(
      updateTask({
        taskId: props.task.id,
        model: {
          status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        },
        todolistId: props.todolistId,
      })
    );
  };

  const titleChangeHandler = (newValue: string) => {
    dispatch(
      updateTask({
        taskId: props.task.id,
        model: { title: newValue },
        todolistId: props.todolistId,
      })
    );
  };
  return (
    <div
      key={props.task.id}
      className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
    >
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={updateTaskHandler}
      />

      <EditableSpan
        value={props.task.title}
        onChange={titleChangeHandler}
      />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
};
