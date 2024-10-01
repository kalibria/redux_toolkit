import { useFormik } from 'formik';
import { login, selectIsLoggedIn } from 'features/Login/auth-reducer';
import { BaseResponseType } from 'api/todolists-api';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from 'hooks/useAppDispatch';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) {
        return {
          email: 'Email is required',
        };
      }
      if (!values.password) {
        return {
          password: 'Password is required',
        };
      }
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers) => {
      dispatch(login(values))
        .unwrap()
        .catch((error: BaseResponseType) => {
          error.fieldsErrors?.forEach((el) => {
            formikHelpers.setFieldError(el.field, el.error);
          });
        });
    },
  });

  return { formik, isLoggedIn };
};
