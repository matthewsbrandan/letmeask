import { FormEvent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-dark.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

export function Home(){
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const { theme, btnToggleTheme } = useTheme();
  const [roomCode, setRoomCode] = useState('');
  // BEGIN:: SPLASH
  const [inSplash,setInSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => setInSplash(false),300);
  },[]);
  // END:: SPLASH

  async function handleCreateRoom(){
    if(!user){
      await signInWithGoogle();
    }
    
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    
    if(!roomRef.exists()){
      alert('Room does not exists.');
      return;
    }
    if(roomRef.val().endedAt){
      alert('Room already closed.');
      return;
    }
    
    history.push(`/rooms/${roomCode}`);
  }
  return (
    <div id="page-auth" className={theme == 'dark'? 'theme-dark':''}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          { btnToggleTheme() }
          { theme == 'light' ? (
            <img src={logoImg} alt="Letmeask"/>
          ):(
            <img src={logoDarkImg} alt="Letmeask"/>
          )}
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google"/>
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={event => setRoomCode(event.target.value)}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}