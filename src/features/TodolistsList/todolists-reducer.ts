import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { todolistsAPI, TodolistType } from 'api/todolists-api';
import { RequestStatusType, setAppStatusAC } from 'app/app-reducer';
import { AppThunk } from 'app/store';
import { handleServerNetworkError } from 'utils/error-utils';

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const initialState: Array<TodolistDomainType> = [];

const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    addTodolistAC(state, action: PayloadAction<TodolistType>) {
      return [
        { ...action.payload, filter: 'all', entityStatus: 'idle' },
        ...state,
      ];
    },
    removeTodolistAC(state, action: PayloadAction<string>) {
      return state.filter((tl) => tl.id != action.payload);
    },
    changeTodolistTitleAC(
      state,
      action: PayloadAction<{
        id: string;
        title: string;
      }>
    ) {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, title: action.payload.title }
          : tl
      );
    },
    changeTodolistFilterAC(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, filter: action.payload.filter }
          : tl
      );
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, entityStatus: action.payload.status }
          : tl
      );
    },
    setTodolistsAC(state, action: PayloadAction<Array<TodolistType>>) {
      return action.payload.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }));
    },
  },
});

export const todolistsReducer = todoListSlice.reducer;
export const {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  changeTodolistTitleAC,
} = todoListSlice.actions;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data));
        dispatch(setAppStatusAC('succeeded'));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC('loading'));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(
      changeTodolistEntityStatusAC({ id: todolistId, status: 'loading' })
    );
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolistAC(todolistId));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setAppStatusAC('succeeded'));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC(res.data.data.item));
      dispatch(setAppStatusAC('succeeded'));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitleAC({ id: id, title: title }));
    });
  };
};
