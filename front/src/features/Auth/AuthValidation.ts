// src/features/Auth/AuthValidation.ts

import * as Yup from 'yup';

// 로그인 폼 유효성 검증 스키마
export const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .email('Invalid email format. Please enter a valid email address.')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

// 회원가입 폼 유효성 검증 스키마 (필요한 경우)
export const registerValidationSchema = Yup.object().shape({
  school: Yup.string().required('School is required'),
  studentId: Yup.string().when('role', {
    is: (role: string) => role === 'student',
    then: (schema) => schema.required('Student ID is required'),
  }),
  subject: Yup.string().when('role', {
    is: (role: string) => role === 'teacher',
    then: (schema) => schema.required('Subject is required'),
  }),
  name: Yup.string().required('Name is required'),
  username: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one letter, one number, and one special character'
    )
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
});
