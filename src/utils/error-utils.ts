import { setAppError, setAppStatus } from 'app/app-reducer';
import { Dispatch } from 'redux';
import { BaseResponseType } from 'features/TodolistsList/api/todolistsApi';

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  isShowGlobalError: boolean = true
) => {
  if (isShowGlobalError) {
    if (data.messages.length) {
      dispatch(setAppError(data.messages[0]));
    } else {
      dispatch(setAppError('Some error occurred'));
    }
  } else dispatch(setAppStatus('failed'));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch
) => {
  dispatch(setAppError(error.message ? error.message : 'Some error occurred'));
  dispatch(setAppStatus('failed'));
};
