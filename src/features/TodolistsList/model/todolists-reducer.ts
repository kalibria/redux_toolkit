import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RequestStatus, setAppStatus } from 'app/app-reducer';
import { handleServerNetworkError } from 'utils/error-utils';
import { createAppAsyncThunk } from 'utils/createAppAsyncThunk';
import {
  TodolistType,
  UpdateTodoTypesArgs,
} from 'features/TodolistsList/api/todoListApi.types';
import { todolistsApi } from 'features/TodolistsList/api/todolistsApi';

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatus;
};

const initialState: Array<TodolistDomainType> = [];

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const todoListSlice = createAppSlice({
  name: 'todoList',
  initialState,
  reducers: {
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatus }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTodoList.fulfilled, (state, action) => {
        return action.payload.map((tl) => ({
          ...tl,
          filter: 'all',
          entityStatus: 'idle',
        }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload,
          filter: 'all',
          entityStatus: 'idle',
        });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state[index].title = action.payload.title;
      });
  },
  selectors: {
    selectTodoLists: (state) => state,
  },
});

export const { changeTodolistFilter, changeTodolistEntityStatus } =
  todoListSlice.actions;
export const { selectTodoLists } = todoListSlice.selectors;

// thunks

export const fetchTodoList = createAppAsyncThunk<TodolistType[]>(
  `${todoListSlice.name}/fetchTodoList`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus('loading'));
      const res = await todolistsApi.getTodolists();
      dispatch(setAppStatus('succeeded'));
      return res.data;
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTodolist = createAppAsyncThunk<
  string,
  { todolistId: string }
>(`${todoListSlice.name}`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus('loading'));
    dispatch(
      changeTodolistEntityStatus({ id: arg.todolistId, status: 'loading' })
    );
    const res = await todolistsApi.deleteTodolist(arg.todolistId);
    dispatch(setAppStatus('succeeded'));
    return arg.todolistId;
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const addTodolist = createAppAsyncThunk<TodolistType, string>(
  `${todoListSlice.name}/addTodolist`,
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus('loading'));
      const res = await todolistsApi.createTodolist(title);
      dispatch(setAppStatus('succeeded'));
      return res.data.data.item;
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const changeTodolistTitle = createAppAsyncThunk<
  UpdateTodoTypesArgs,
  UpdateTodoTypesArgs
>(
  `${todoListSlice.name}/changeTodolistTitle`,
  async ({ id, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistsApi.updateTodolist(id, title);
      return { id: id, title: title };
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);
