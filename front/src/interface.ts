export interface IErrorDetail {
  detail: {
    msg: string;
  };
}

export interface IAnswer {
  _id: string;
  content: string;
  create_date: string;
  question_id: string;
}

export interface IQuestion {
  _id: string; // MongoDB의 _id를 그대로 사용
  subject: string;
  content: string;
  create_date: string;
  answers: IAnswer[];
}