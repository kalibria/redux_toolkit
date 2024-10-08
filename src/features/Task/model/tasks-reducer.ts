import { createSlice } from '@reduxjs/toolkit';

import { setAppStatus } from 'app/app-reducer';

import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';
import { createAppAsyncThunk } from 'utils/createAppAsyncThunk';
import { thunkTryCatch } from 'utils/thunkTryCatch';
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskModelType,
} from 'features/Task/api/tasksApi.types';
import {
  addTodolist,
  fetchTodoList,
  removeTodolist,
} from 'features/TodolistsList/model/todolists-reducer';
import { taskApi } from 'features/Task/api/taskApi';
import { UpdateTypesArgs } from 'features/TodolistsList/api/todolistsApi';

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
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const task = tasks.find((task) => task.id === action.payload.taskId);
        if (task) {
          Object.assign(task, action.payload.model);
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex(
          (todo) => todo.id === action.payload.taskId
        );
        if (index !== -1) tasks.splice(index, 1);
      })

      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload];
      })

      .addCase(fetchTodoList.fulfilled, (state, action) => {
        action.payload.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  },
  selectors: {
    selectTasks: (state) => state,
  },
});

export const { selectTasks } = taskSlice.selectors;

// thunks
export const fetchTasks = createAppAsyncThunk<
  { tasks: TaskType[]; todolistId: string },
  string
>(`${taskSlice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus('loading'));
    const res = await taskApi.getTasks(todolistId);
    const tasks = res.data.items;
    dispatch(setAppStatus('succeeded'));
    return { tasks, todolistId };
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const addTask = createAppAsyncThunk<
  { task: TaskType },
  { todolistId: string; title: string }
>(`${taskSlice.name}/addTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await taskApi.createTask(arg.todolistId, arg.title);
    if (res.data.resultCode === 0) {
      return { task: res.data.data.item };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const updateTask = createAppAsyncThunk<UpdateTypesArgs, UpdateTypesArgs>(
  `${taskSlice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      const task = getState().tasks[arg.todolistId].find(
        (t) => t.id === arg.taskId
      );
      if (!task) {
        //throw new Error("task not found in the state");
        console.warn('task not found in the state');
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.model,
      };

      const res = await taskApi.updateTask(
        arg.todolistId,
        arg.taskId,
        apiModel
      );

      if (res.data.resultCode === 0) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerAppError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTask = createAppAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string }
>(`${taskSlice.name}/removeTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await taskApi.deleteTask(arg.todolistId, arg.taskId);
    return { taskId: arg.taskId, todolistId: arg.todolistId };
  } catch (error: any) {
    handleServerAppError(error, dispatch);
    return rejectWithValue(null);
  }
});
