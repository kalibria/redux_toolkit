import {
  addTodolist,
  TodolistDomainType,
  todoListSlice,
} from './todolists-reducer';
import { taskSlice, TasksState } from './tasks-reducer';
import { TodolistType } from 'api/todolists-api';
import { TestAction } from 'common/types/types';

test('ids should be equals', () => {
  const startTasksState: TasksState = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  let todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  };

  const action: TestAction<typeof addTodolist.fulfilled> = {
    type: addTodolist.fulfilled.type,
    payload: todolist,
  };

  const endTasksState = taskSlice.reducer(startTasksState, action);
  const endTodolistsState = todoListSlice.reducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolists).toBe(action.payload.id);
});
