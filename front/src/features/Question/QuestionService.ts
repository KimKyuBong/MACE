import fastapi from 'features/Common/utils/fastapi';
import {
  Question,
  Answer,
  PostQuestionParams,
} from './QuestionInterfaces';

export const postQuestion = async (
  params: PostQuestionParams,
  token: string
) => {
  const url = '/question/create';
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      url,
      params,
      token, // 토큰 포함
      (data: any) => resolve(data),
      (error: any) => reject(error)
    );
  });
};

export const fetchQuestions = async (token: string): Promise<Question[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    fastapi(
      'get',
      '/question/list',
      {},
      token, // 토큰 포함
      (data?: Question[]) => {
        if (data) {
          resolve(data);
        } else {
          console.error('Received undefined data from API');
          reject(new Error('Received undefined data from API'));
        }
      },
      (error: Error) => {
        console.error('Error fetching data:', error);
        reject(error);
      }
    );
  });
};

export const getQuestionDetail = async (
  id: string,
  token: string
): Promise<Question> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'get',
      `/question/detail/${id}`,
      {},
      token, // 토큰 포함
      (json: Question) => {
        resolve(json);
      },
      (error: any) => {
        reject(error);
      }
    );
  });
};

export const postAnswer = async (
  questionId: string,
  content: string,
  token: string
): Promise<Answer> => {
  return new Promise((resolve, reject) => {
    fastapi(
      'post',
      `/answer/create/${questionId}`,
      { content },
      token, // 토큰 포함
      (json: Answer) => {
        resolve(json);
      },
      (error: any) => {
        reject(error);
      }
    );
  });
};
