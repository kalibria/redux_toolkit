import { authSlice } from 'features/Login/auth-reducer';
import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from 'app/app-reducer';
import { taskSlice } from 'features/Task/model/tasks-reducer';
import { todoListSlice } from 'features/TodolistsList/model/todolists-reducer';

export const store = configureStore({
  reducer: {
    [taskSlice.reducerPath]: taskSlice.reducer,
    [todoListSlice.reducerPath]: todoListSlice.reducer,
    [appSlice.reducerPath]: appSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
export type AppDispatch = typeof store.dispatch;
