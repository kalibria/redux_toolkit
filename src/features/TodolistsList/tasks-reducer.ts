import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
  UpdateTypesArgs,
} from 'api/todolists-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTodolist,
  removeTodolist,
  setTodolists,
} from 'features/TodolistsList/todolists-reducer';
import { AppDispatch, AppRootStateType, AppThunk } from 'app/store';
import { setAppStatus } from 'app/app-reducer';

import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';
import { createAppAsyncThunk } from 'utils/createAppAsyncThunk';

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
  },
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
  selectors: {
    selectTasks: (state) => state,
  },
});

export const { removeTask } = taskSlice.actions;
export const { selectTasks } = taskSlice.selectors;

// thunks
export const fetchTasks = createAppAsyncThunk<
  { tasks: TaskType[]; todolistId: string },
  string
>(`${taskSlice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus('loading'));
    const res = await todolistsAPI.getTasks(todolistId);
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

  dispatch(setAppStatus('loading'));
  const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
  try {
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus('succeeded'));
      return { task: res.data.data.item };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
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

      const res = await todolistsAPI.updateTask(
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

export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = removeTask({ taskId: taskId, todolistId: todolistId });
      dispatch(action);
    });
  };
