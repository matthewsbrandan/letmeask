import { useHistory, useParams } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { database } from "../services/firebase";
import { useRoom } from "../hooks/useRoom";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import logoImg from "../assets/images/logo.svg";
import logoDarkImg from "../assets/images/logo-dark.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import '../styles/room.scss';
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";

type RoomParams = {
  id: string;
}


export function AdminRoom(){
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions, endedAt } = useRoom(roomId);
  const { theme, btnToggleTheme } = useTheme();
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(true);

  function handleDate(date: string){
    let dateParsed = new Date(date);
    let day = String(dateParsed.getDate());
    let month = String(dateParsed.getMonth()+1);

    return `${day.padStart(2,'0')}/${month.padStart(2,'0')}/${dateParsed.getFullYear()}`;

  }
  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });
    history.push('/');
  }
  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
  async function handleCheckQuestionAsAnswered(questionId: string, isAnswered?: boolean){
    if(isAnswered) await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: false
    });
    else await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }
  async function handleHighlightQuestion(questionId: string, isHighlighted?: boolean){
    if(isHighlighted) await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: false
    });
    else await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }
  return (
    <div id="page-room" className={theme == 'dark'? 'theme-dark':''}>
      <Toaster/>
      <header>
        <div className="content">
          <img src={ theme == 'light' ? logoImg : logoDarkImg } alt="Letmeask" onClick={
            () => history.push('/home')
          }/>
          <button type="button" className="btn-collapse" onClick={() => setIsCollapsed(!isCollapsed)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"></path></svg>
          </button>
          <div className={isCollapsed ? 'collapsed':''}>
            <button type="button" className="members" onClick={() => history.push(`/rooms/${roomId}`)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.604,11.048c0.604-1.029,0.872-2.228,0.751-3.44c-0.179-1.784-1.175-3.361-2.803-4.44l-1.105,1.666 c1.119,0.742,1.8,1.799,1.918,2.974c0.11,1.105-0.28,2.194-1.072,2.986l-1.192,1.192l1.618,0.475C18.951,13.701,19,17.957,19,18h2 C21,16.211,20.044,12.715,16.604,11.048z"></path><path d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4S7.294 12 9.5 12zM9.5 6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2S8.397 6 9.5 6zM11 13H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1C17 15.691 14.309 13 11 13z"></path></svg>
            </button>
            <RoomCode code={roomId}/>
            {!endedAt && (
              <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
            )}
            { btnToggleTheme() }
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} perguntas</span>
          )}
          {endedAt && <span>Fechada em {handleDate(endedAt)}</span>}
        </div>
        <div className="question-list">
          {questions.map(question => { return (
            <Question
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
              key={question.id}
            >
              <button
                type="button"
                onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
              >
                <img src={checkImg} alt="Marcar pergunta como respondida"/>
              </button>
              {!question.isAnswered && (
                <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                >
                  <img src={answerImg} alt="Dar destaque à pergunta"/>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta"/>
              </button>
            </Question>
          );})}
        </div>
      </main>
    </div>
  );
}