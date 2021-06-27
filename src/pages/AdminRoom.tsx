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

type RoomParams = {
  id: string;
}


export function AdminRoom(){
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const { theme, btnToggleTheme } = useTheme();
  const history = useHistory();

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
            () => history.push('/')
          }/>
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
        { btnToggleTheme() }
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} perguntas</span>
          )}
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