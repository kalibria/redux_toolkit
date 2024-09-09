import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, LoginParamsType } from 'api/todolists-api';
import { Dispatch } from 'redux';
import {
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from 'app/app-reducer';
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';
import { AppThunk } from 'app/store';

type InitialStateType = {
  isLoggedIn: boolean;
};

const initialState: InitialStateType = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<boolean>) {
      return { ...state, isLoggedIn: action.payload };
    },
  },
});

export const authReducer = authSlice.reducer;

export const { setIsLoggedInAC } = authSlice.actions;

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC(true));
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC('loading'));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
