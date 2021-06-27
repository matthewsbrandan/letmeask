import { useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-dark.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

export function Login(){
  const history = useHistory();
  const { user, signInWithGoogle, signOut } = useAuth();
  const { theme, btnToggleTheme } = useTheme();

  async function handleOutherAccount(){
    if(await signOut()){
      handleSignIn();
    }
    else alert('Houve um erro ao desconectar da sua conta');
  }
  async function handleSignIn(){
    if(!user){
      await signInWithGoogle();
    }
    
    history.push('/home');
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
          <img src={ theme == 'light' ? logoImg : logoDarkImg} alt="Letmeask"/>
          <h2>Acesse sua conta</h2>
          {user ? (
            <>
              <button className="btn-login" onClick={() => history.push('/home')}>
                Entrar como {user.name}
              </button>
              <button className="btn-outher-account" onClick={handleOutherAccount}>
                Entrar com outra conta
              </button>
            </>
          ):(
            <button className="btn-login" onClick={handleSignIn}>
              <img src={googleIconImg} alt="Logo do Google"/>
              Entrar com o Google
            </button>
          )}
        </div>
      </main>
    </div>
  );
}