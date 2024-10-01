import { setAppStatus } from 'app/app-reducer';
import { handleServerNetworkError } from 'utils/error-utils';
import { AppDispatch } from 'app/store';

export type ThunkApi = {
  dispatch: AppDispatch;
  rejectWithValue: any;
};

export const thunkTryCatch = async (
  thunkAPI: ThunkApi,
  logic: () => Promise<any>
) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  try {
    dispatch(setAppStatus('loading'));
    return await logic();
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(setAppStatus('idle'));
  }
};
