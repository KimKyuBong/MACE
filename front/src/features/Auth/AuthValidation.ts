// src/features/Auth/AuthValidation.ts

import * as Yup from 'yup';

// 로그인 폼 유효성 검증 스키마
export const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .email('유효하지 않은 이메일 형식입니다. 올바른 이메일 주소를 입력해 주세요.')
    .required('이메일은 필수 입력 항목입니다.'),
  password: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .required('비밀번호는 필수 입력 항목입니다.'),
});

// 조건부 필드 생성 함수 수정
const conditionalField = (fieldName: string, condition: string, requiredMessage: string) => 
  Yup.string().test({
    name: `${fieldName}-required-for-${condition}`,
    message: requiredMessage,
    test: function (value) {
      return this.parent.role !== condition || Boolean(value && value.length > 0);
    }
  });

// 회원가입 폼 유효성 검증 스키마
export const registerValidationSchema = Yup.object().shape({
  school: Yup.string().required('학교명은 필수 입력 항목입니다.'),
  studentId: conditionalField('studentId', 'student', '학번은 필수 입력 항목입니다.'),
  subject: conditionalField('subject', 'teacher', '과목은 필수 입력 항목입니다.'),
  name: Yup.string().required('이름은 필수 입력 항목입니다.'),
  username: Yup.string()
    .email('유효하지 않은 이메일 형식입니다.')
    .required('이메일은 필수 입력 항목입니다.'),
  password: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      '비밀번호는 최소 하나의 문자, 숫자, 특수문자를 포함해야 합니다.'
    )
    .required('비밀번호는 필수 입력 항목입니다.'),
  role: Yup.string().required('역할은 필수 선택 항목입니다.'),
});
