import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import { IQuestion } from '../interface';
import useWebSocket from '../hooks/useWebSocket';  

function Home() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const { lastMessage, isConnected } = useWebSocket('ws://192.168.1.105:8000/ws/question');

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const messageData = lastMessage.data; // 메시지 데이터 추출
      const message = typeof messageData === 'string' ? JSON.parse(messageData) : messageData; // JSON 형식으로 파싱
      console.log(message);
      switch(message.type) {
        case 'new_question':
          addNewQuestion(message.data);
          break;
        case 'delete_question':
          deleteQuestion(message.data._id);
          break;
        case 'update_question':
          updateQuestion(message.data);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  const fetchQuestions = async () => {
    try {
      await fastapi(
        'get',
        "/api/question/list",
        {},
        (data?: IQuestion[]) => {
          if (data) {
            setQuestions(data);
          } else {
            console.error('Received undefined data from API');
          }
        },
        (error: Error) => {
          console.error('Error fetching data:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addNewQuestion = (newQuestion: IQuestion) => {
    setQuestions(prevQuestions => [newQuestion, ...prevQuestions]);
  };

  const deleteQuestion = (id: string) => { // id 타입을 string으로 변경
    setQuestions(prevQuestions => prevQuestions.filter(question => question._id !== id));
  };

  const updateQuestion = (updatedQuestion: IQuestion) => {
    setQuestions(prevQuestions => prevQuestions.map(question => question._id === updatedQuestion._id ? updatedQuestion : question));
  };

  return (
    <div className="container my-3">
      <table className="table">
        <thead>
          <tr className="table-dark">
            <th> 번호 </th>
            <th> 제목 </th>
            <th> 작성 일시 </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question._id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/detail/${question._id}`}>{question.subject}</Link>
              </td>
              <td>{new Date(question.create_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={'/question-create'}>질문 등록하기</Link>
    </div>
  );
}

export default Home;
