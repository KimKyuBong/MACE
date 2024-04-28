// types.ts 파일
export interface IAnswer {
    id: number;
    content: string;
    create_date: string;
  }
  
export interface IQuestion {
    id: number;
    subject: string;
    content: string;
    create_date: string;
    answers: IAnswer[];
  }
  
export interface IErrorDetail {
  detail: {
    msg: string;
 
  }
}