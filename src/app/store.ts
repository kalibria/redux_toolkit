import { taskSlice } from 'features/TodolistsList/tasks-reducer';
import { todoListSlice } from 'features/TodolistsList/todolists-reducer';
import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { authSlice } from 'features/Login/auth-reducer';
import {
  combineReducers,
  configureStore,
  UnknownAction,
} from '@reduxjs/toolkit';
import { appSlice } from 'app/app-reducer';

const rootReducer = combineReducers({
  [taskSlice.reducerPath]: taskSlice.reducer,
  [todoListSlice.reducerPath]: todoListSlice.reducer,
  [appSlice.reducerPath]: appSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
});

// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({ reducer: rootReducer });

export type AppRootStateType = ReturnType<typeof store.getState>;

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  UnknownAction
>;

// export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
export type AppDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  UnknownAction
>;
