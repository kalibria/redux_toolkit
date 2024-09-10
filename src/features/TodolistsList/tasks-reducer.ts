import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from 'api/todolists-api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from 'features/TodolistsList/todolists-reducer';
import { AppRootStateType, AppThunk } from 'app/store';
import { setAppStatusAC } from 'app/app-reducer';
import App from 'app/App';
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils';
import { ThunkDispatch } from 'redux-thunk';

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

const initialState: TasksStateType = {};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTaskAC(
      state,
      action: PayloadAction<{
        taskId: string;
        todolistId: string;
      }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          (t) => t.id != action.payload.taskId
        ),
      };
    },
    addTaskAC(state, action: PayloadAction<TaskType>) {
      return {
        ...state,
        [action.payload.todoListId]: [
          action.payload,
          ...state[action.payload.todoListId],
        ],
      };
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(
          (t) =>
            t.id === action.payload.taskId
              ? { ...t, ...action.payload.model }
              : t
        ),
      };
    },
    setTasksAC(
      state,
      action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    ) {
      return { ...state, [action.payload.todolistId]: action.payload.tasks };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTodolistAC, (state, action) => {
        return { ...state, [action.payload.id]: [] };
      })
      .addCase(removeTodolistAC, (state, action) => {
        const copyState = { ...state };
        delete copyState[action.payload];
        return copyState;
      })
      .addCase(setTodolistsAC, (state, action) => {
        const copyState = { ...state };
        action.payload.forEach((tl) => {
          copyState[tl.id] = [];
        });
        return copyState;
      });
  },
});

export const tasksReducer = taskSlice.reducer;
export const { removeTaskAC, setTasksAC, addTaskAC, updateTaskAC } =
  taskSlice.actions;

// thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(setTasksAC({ tasks, todolistId }));
      dispatch(setAppStatusAC('succeeded'));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = removeTaskAC({ taskId: taskId, todolistId: todolistId });
      dispatch(action);
    });
  };
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          const action = addTaskAC(task);
          dispatch(action);
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
  ): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state');
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTaskAC({
            taskId: taskId,
            model: domainModel,
            todolistId: todolistId,
          });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
