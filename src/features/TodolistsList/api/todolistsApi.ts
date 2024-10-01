import axios from 'axios';
import { TodolistType } from 'features/TodolistsList/api/todoListApi.types';
import { UpdateDomainTaskModelType } from 'features/Task/model/tasks-reducer';

const settings = {
  withCredentials: true,
  headers: {
    'API-KEY': 'bdddab54-0906-470b-b839-c930a74d2799',
  },
};
export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  ...settings,
});

// api
export const todolistsApi = {
  getTodolists() {
    const promise = instance.get<TodolistType[]>('todo-lists');
    return promise;
  },
  createTodolist(title: string) {
    const promise = instance.post<BaseResponseType<{ item: TodolistType }>>(
      'todo-lists',
      { title: title }
    );
    return promise;
  },
  deleteTodolist(id: string) {
    const promise = instance.delete<BaseResponseType>(`todo-lists/${id}`);
    return promise;
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<BaseResponseType>(`todo-lists/${id}`, {
      title: title,
    });
    return promise;
  },
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

export const authAPI = {
  login(data: LoginParamsType) {
    const promise = instance.post<BaseResponseType<{ userId?: number }>>(
      'auth/login',
      data
    );
    return promise;
  },
  logout() {
    const promise =
      instance.delete<BaseResponseType<{ userId?: number }>>('auth/login');
    return promise;
  },
  me() {
    const promise =
      instance.get<
        BaseResponseType<{ id: number; email: string; login: string }>
      >('auth/me');
    return promise;
  },
};

// types
export type UpdateTypesArgs = {
  taskId: string;
  model: UpdateDomainTaskModelType;
  todolistId: string;
};

export type FieldErrorType = {
  error: string;
  field: string;
};

//❗ Чтобы у нас не было пересечения имен наовем общий тип BaseResponseType
export type BaseResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
  fieldsErrors: FieldErrorType[];
};
