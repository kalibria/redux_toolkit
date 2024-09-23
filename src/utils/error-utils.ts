import { setAppError, setAppStatus } from 'app/app-reducer';
import { BaseResponseType } from 'api/todolists-api';
import { Dispatch } from 'redux';

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch
) => {
  if (data.messages.length) {
    dispatch(setAppError(data.messages[0]));
  } else {
    dispatch(setAppError('Some error occurred'));
  }
  dispatch(setAppStatus('failed'));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch
) => {
  dispatch(setAppError(error.message ? error.message : 'Some error occurred'));
  dispatch(setAppStatus('failed'));
};
