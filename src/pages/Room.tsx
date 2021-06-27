import { useState, FormEvent } from "react";
import { useHistory, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import logoImg from "../assets/images/logo.svg";
import logoDarkImg from "../assets/images/logo-dark.svg";

import '../styles/room.scss';
import { useTheme } from "../hooks/useTheme";

type RoomParams = {
  id: string;
}


export function Room(){
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  
  const [newQuestion, setNewQuestion] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, signInWithGoogle } = useAuth();
  const { theme, btnToggleTheme } = useTheme();
  const history = useHistory();

  async function handleSendQuestion(event: FormEvent){
    event.preventDefault();

    if(newQuestion.trim() === '') return ;
    if(!user) throw new Error('You must be logged in');

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);
    toast.success('Pergunta enviada!');
    setNewQuestion('');
  }
  async function handleLikeQuestion(questionId: string, likeId?: string){
    if(likeId) await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    else await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
      authorId: user?.id,
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
            <RoomCode code={roomId}/>
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
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          ></textarea>
          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name}/>
                <span>{user.name}</span>
              </div>
            ):(
              <span>
                Para enviar uma pergunta,&nbsp; 
                <button type="button" onClick={signInWithGoogle}>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <div className="question-list">
          {questions.map(question => { return (
            <Question
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
              key={question.id}
            >
            {!question.isAnswered && (
              <button
                type="button"
                className={`like-button ${question.likeId?'liked':''}`}
                aria-label="Marcar como gostei"
                onClick={() => handleLikeQuestion(question.id, question.likeId)}
              >
                { question.likeCount > 0 && <span>{question.likeCount}</span> }
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            </Question>
          );})}
        </div>
      </main>
    </div>
  );
}