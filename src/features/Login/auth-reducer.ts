import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, LoginParamsType } from 'api/todolists-api';
import { setAppStatus } from 'app/app-reducer';
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';
import { AppThunk } from 'app/store';

type InitialState = {
  isLoggedIn: boolean;
};

const initialState: InitialState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
});

export const { setIsLoggedIn } = authSlice.actions;
export const { selectIsLoggedIn } = authSlice.selectors;

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus('loading'));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn(true));
          dispatch(setAppStatus('succeeded'));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatus('loading'));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn(false));
        dispatch(setAppStatus('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
