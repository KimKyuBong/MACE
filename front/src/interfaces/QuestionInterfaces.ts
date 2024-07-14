import * as C from './CommonInterfaces'
  
export interface Answer {
    _id: string;
    content: string;
    create_date: string;
    question_id: string;
  }
  
export interface Question {
    _id: string; // MongoDB의 _id를 그대로 사용
    subject: string;
    content: string;
    create_date: string;
    answers: Answer[];
  }

export interface QuestionItemProps {
    question: Question;
    index: number;
  }
  
export  interface QuestionListProps {
    questions: Question[];
  }

  
export  interface QuestionDetailProps {
    question: Question | undefined;
    error: C.ErrorDetail;
    answer: string;
    setAnswer: (value: string) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  }

export  interface PostQuestionParams {
    subject: string;
    content: string;
  }
  
export interface AnswerItemProps {
    answer: {
      _id: string;
      content: string;
    };
  }



