import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, LoginParamsType } from 'api/todolists-api';
import { setAppInitialized, setAppStatus } from 'app/app-reducer';
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';
import { createAppAsyncThunk } from 'utils/createAppAsyncThunk';

type InitialState = {
  isLoggedIn: boolean;
};

const initialState: InitialState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
});

export const { selectIsLoggedIn } = authSlice.selectors;

// thunks
export const login = createAppAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType
>(`${authSlice.name}/login`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(setAppStatus('loading'));

  try {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus('succeeded'));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch);
    }
    return rejectWithValue(null);
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${authSlice.name} / logOut}`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatus('loading'));
    try {
      const res = await authAPI.logout();

      if (res.data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const initializeApp = createAppAsyncThunk<
  { isLoggedIn: boolean },
  undefined
>(`${authSlice.name}/initializeApp`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();

    if (res.data.resultCode === 0) {
      return { isLoggedIn: true };
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);

    return rejectWithValue(null);
  } finally {
    dispatch(setAppInitialized(true));
  }
});
