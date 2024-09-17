import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { todolistsAPI, TodolistType } from 'api/todolists-api';
import { RequestStatus, setAppStatus } from 'app/app-reducer';
import { AppThunk } from 'app/store';
import { handleServerNetworkError } from 'utils/error-utils';
import { createAppAsyncThunk } from 'utils/createAppAsyncThunk';
import { useDispatch } from 'react-redux';

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatus;
};

const initialState: Array<TodolistDomainType> = [];

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    addTodolist(state, action: PayloadAction<TodolistType>) {
      state.unshift({ ...action.payload, filter: 'all', entityStatus: 'idle' });
    },
    removeTodolist(state, action: PayloadAction<string>) {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) state.splice(index, 1);
    },
    changeTodolistTitle(
      state,
      action: PayloadAction<{
        id: string;
        title: string;
      }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].title = action.payload.title;
    },
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
    // setTodolists(_state, action: PayloadAction<Array<TodolistType>>) {
    //   return action.payload.map((tl) => ({
    //     ...tl,
    //     filter: 'all',
    //     entityStatus: 'idle',
    //   }));
    // },
  },
  extraReducers(builder) {
    builder.addCase(fetchTodoList.fulfilled, (state, action) => {
      return action.payload.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }));
    });
  },
  selectors: {
    selectTodoLists: (state) => state,
  },
});

export const {
  addTodolist,
  removeTodolist,
  changeTodolistFilter,
  changeTodolistEntityStatus,
  changeTodolistTitle,
} = todoListSlice.actions;
export const { selectTodoLists } = todoListSlice.selectors;

// thunks

export const fetchTodoList = createAppAsyncThunk<TodolistType[]>(
  `${todoListSlice.name}/fetchTodoList`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus('loading'));
      const res = await todolistsAPI.getTodolists();
      dispatch(setAppStatus('succeeded'));
      return res.data;
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus('loading'));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: 'loading' }));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist(todolistId));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setAppStatus('succeeded'));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus('loading'));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist(res.data.data.item));
      dispatch(setAppStatus('succeeded'));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitle({ id: id, title: title }));
    });
  };
};
