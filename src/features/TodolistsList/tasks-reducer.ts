import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from 'api/todolists-api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTodolist,
  removeTodolist,
  setTodolists,
} from 'features/TodolistsList/todolists-reducer';
import { AppRootStateType, AppThunk } from 'app/store';
import { setAppStatus } from 'app/app-reducer';

import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';

export type TasksState = {
  [key: string]: Array<TaskType>;
};
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

const initialState: TasksState = {};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{
        taskId: string;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (todo) => todo.id === action.payload.taskId
      );
      if (index !== -1) tasks.splice(index, 1);
    },
    addTask(state, action: PayloadAction<TaskType>) {
      const tasks = state[action.payload.todoListId];
      tasks.unshift(action.payload);
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const task = tasks.find((task) => task.id === action.payload.taskId);
      if (task) {
        Object.assign(task, action.payload.model);
      }
    },
    setTasks(
      state,
      action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTodolist, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload];
      })
      .addCase(setTodolists, (state, action) => {
        action.payload.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  },
});

export const { removeTask, setTasks, addTask, updateTask } = taskSlice.actions;

// thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus('loading'));
    todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(setTasks({ tasks, todolistId }));
      dispatch(setAppStatus('succeeded'));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = removeTask({ taskId: taskId, todolistId: todolistId });
      dispatch(action);
    });
  };
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus('loading'));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          const action = addTask(task);
          dispatch(action);
          dispatch(setAppStatus('succeeded'));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
  ): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state');
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTask({
            taskId: taskId,
            model: domainModel,
            todolistId: todolistId,
          });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
