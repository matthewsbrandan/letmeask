import { useEffect, useState, createContext, ReactNode } from 'react';

import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user?: User;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<boolean>;
}
type AuthContextProviderProps = {
  children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){
  const [user, setUser] = useState<User>();

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const { displayName, photoURL, uid } = user;
  
        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account.');
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        }); 
      }
    });

    return () => { unsubscribe(); }
  },[]);
  
  async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    
    const result = await auth.signInWithPopup(provider);

    if(result.user){
      const { displayName, photoURL, uid } = result.user;

      if(!displayName || !photoURL){
        throw new Error('Missing information from Google Account.');
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    }
  }
  async function signOut(){
    const provider = new firebase.auth.GoogleAuthProvider();
    try{
      await auth.signInWithPopup(provider);
      setUser(undefined);
      return true;
    }
    catch(err){
      return false;
    }
  }
  return (
    <AuthContext.Provider value={{
      user, signInWithGoogle, signOut
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}