import {
  appSlice,
  InitialState,
  setAppError,
  setAppStatus,
} from './app-reducer';

let startState: InitialState;

beforeEach(() => {
  startState = {
    error: null,
    status: 'idle',
    isInitialized: false,
  };
});

test('correct error message should be set', () => {
  const endState = appSlice.reducer(startState, setAppError('some error'));
  expect(endState.error).toBe('some error');
});

test('correct status should be set', () => {
  const endState = appSlice.reducer(startState, setAppStatus('loading'));
  expect(endState.status).toBe('loading');
});
