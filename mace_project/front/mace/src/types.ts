// types.ts 파일
export interface Answer {
    id: number;
    content: string;
    create_date: string;
  }
  
  export interface Question {
    id: number;
    subject: string;
    content: string;
    create_date: string;
    answers: Answer[];
  }
  