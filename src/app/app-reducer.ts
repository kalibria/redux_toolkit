import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
export const appSlice = createSlice({
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
  selectors: {
    selectAppError: (state) => state.error,
    selectAppStatus: (state) => state.status,
    selectAppInitialized: (state) => state.isInitialized,
  },
});

export const { setAppError, setAppStatus, setAppInitialized } =
  appSlice.actions;
export const { selectAppError, selectAppStatus, selectAppInitialized } =
  appSlice.selectors;
