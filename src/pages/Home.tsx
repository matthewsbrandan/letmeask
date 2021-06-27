import { FormEvent, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button';

import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-dark.svg';

import '../styles/home.scss';

type FirebaseRoom = Record<string,{
  authorId: string;
  endedAt?: string;
  title: string;
}>
type Room = {
  id: string;
  endedAt?: string;
  title: string;
}

export function Home(){
  const history = useHistory();
  const { user, signOut } = useAuth();
  const { theme, btnToggleTheme } = useTheme();
  const [roomCode, setRoomCode] = useState('');
  const [rooms, setRooms] = useState<Room[]>();

  useEffect(() => {
    handleGetRooms();
  },[user]);

  async function handleGetRooms(){
    if(user){
      const roomsRef = database.ref('rooms').orderByChild('authorId').equalTo(user.id);
      roomsRef.once('value', snapshot => {
        const firebaseRooms: FirebaseRoom = snapshot.val();
        const parsedRooms = firebaseRooms ? Object.entries(firebaseRooms).map(([key, value]) => {
          return {
            id: key,
            endedAt: value.endedAt ?? undefined,
            title: value.title,
          }
        }):[];
        setRooms(parsedRooms);
      });
    }
  }
  async function handleCreateRoom(){
    history.push('/rooms/new');
  }
  async function handleSignOut(){
    if(await signOut()) history.push('/');
    else alert('Houve um erro ao desconectar da sua conta');
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
    <div id="page-home" className={theme == 'dark'? 'theme-dark':''}>
      <header>
        <div className="content">
          <img src={ theme == 'light' ? logoImg : logoDarkImg } alt="Letmeask"/>
          <div>
            { btnToggleTheme() }
            <button className="btn-outher-account" onClick={handleSignOut} aria-label="Sair">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2 12L7 16 7 13 16 13 16 11 7 11 7 8z"></path><path d="M13.001,2.999c-2.405,0-4.665,0.937-6.364,2.637L8.051,7.05c1.322-1.322,3.08-2.051,4.95-2.051s3.628,0.729,4.95,2.051 s2.051,3.08,2.051,4.95s-0.729,3.628-2.051,4.95s-3.08,2.051-4.95,2.051s-3.628-0.729-4.95-2.051l-1.414,1.414 c1.699,1.7,3.959,2.637,6.364,2.637s4.665-0.937,6.364-2.637c1.7-1.699,2.637-3.959,2.637-6.364s-0.937-4.665-2.637-6.364 C17.666,3.936,15.406,2.999,13.001,2.999z"></path></svg>
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="main-content">
          <div className="user-info">
            { user && (
            <>
              <img src={user.avatar} alt={user.name}/>
              <span>{user.name}</span>
            </>
            )}
          </div>
          <div className="content-rooms">
            <h2>Suas Salas</h2>
            <ul className="list-rooms">
              {rooms && rooms.map((room) => { return (
                <li key={room.id}>
                  <Link to={`admin/rooms/${room.id}`}>
                    {room.title}
                    {room.endedAt ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-label="Sala Fechada"><path d="M12,2C9.243,2,7,4.243,7,7v3H6c-1.103,0-2,0.897-2,2v8c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2v-8c0-1.103-0.897-2-2-2 h-1V7C17,4.243,14.757,2,12,2z M18,12l0.002,8H6v-8H18z M9,10V7c0-1.654,1.346-3,3-3s3,1.346,3,3v3H9z"></path></svg>
                    ):''}
                  </Link>
                </li>
              );})}
            </ul>
            {!rooms || rooms.length == 0 && (
              <span style={{padding: '1rem .3rem'}}>Você não possui salas</span>
            )}
          </div>
          <div className="room-actions">
            <button className="create-room" onClick={handleCreateRoom}>
              Crie uma sala
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
        </div>
      </main>
    </div>
  );
}