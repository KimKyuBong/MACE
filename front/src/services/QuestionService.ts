import fastapi from 'utils/fastapi';
import { Question, Answer, PostQuestionParams } from 'interfaces/QuestionInterfaces';


export const postQuestion = async (params: PostQuestionParams) => {
    const url = "/api/question/create";
    return fastapi("post", url, params);
  };


export const fetchQuestions = async (): Promise<Question[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    fastapi(
      'get',
      "/api/question/list",
      {},
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

export const getQuestionDetail = async (id: string): Promise<Question> => {
  return new Promise((resolve, reject) => {
    fastapi("get", `/api/question/detail/${id}`, {}, (json: Question) => {
      resolve(json);
    }, (error: any) => {
      reject(error);
    });
  });
};

export const postAnswer = async (questionId: string, content: string): Promise<Answer> => {
  return new Promise((resolve, reject) => {
    fastapi("post", `/api/answer/create/${questionId}`, { content }, (json: Answer) => {
      resolve(json);
    }, (error: any) => {
      reject(error);
    });
  });
};