import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from 'api/todolists-api';
import { setIsLoggedInAC } from 'features/Login/auth-reducer';
import { AppThunk } from 'app/store';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false,
};
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppErrorAC(state, action: PayloadAction<string | null>) {
      return { ...state, error: action.payload };
    },
    setAppStatusAC(state, action: PayloadAction<RequestStatusType>) {
      return { ...state, status: action.payload };
    },
    setAppInitializedAC(state, action: PayloadAction<boolean>) {
      return { ...state, isInitialized: action.payload };
    },
  },
});

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
    } else {
    }

    dispatch(setAppInitializedAC(true));
  });
};

export const appReducer = appSlice.reducer;

export const { setAppErrorAC, setAppStatusAC, setAppInitializedAC } =
  appSlice.actions;
