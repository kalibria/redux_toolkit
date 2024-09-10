import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from 'api/todolists-api';
import { setIsLoggedIn } from 'features/Login/auth-reducer';
import { AppThunk } from 'app/store';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialState = {
  status: RequestStatus;
  error: string | null;
  isInitialized: boolean;
};

const initialState: InitialState = {
  status: 'idle',
  error: null,
  isInitialized: false,
};
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setAppStatus(state, action: PayloadAction<RequestStatus>) {
      state.status = action.payload;
    },
    setAppInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
});

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true));
    } else {
    }

    dispatch(setAppInitialized(true));
  });
};

export const appReducer = appSlice.reducer;

export const { setAppError, setAppStatus, setAppInitialized } =
  appSlice.actions;
