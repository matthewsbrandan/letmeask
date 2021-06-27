import { useState, createContext, ReactNode } from 'react';
import sunImg from '../assets/images/sun.svg';
import moonImg from '../assets/images/moon.svg';

type ThemeContextType = {
  theme?: 'light' | 'dark';
  toggleTheme: () => void;
  btnToggleTheme: () => ReactNode;
};
type ThemeContextProps = {
  children: ReactNode;
}
export const ThemeContext = createContext({} as ThemeContextType);
export function ThemeContextProvider({children}: ThemeContextProps){
  const [theme,setTheme] = useState<'light'|'dark'>(() => {
    let localTheme = localStorage.getItem('theme');
    if(localTheme && localTheme == 'dark'){
      let body = document.querySelector('body');
      if(body) body.style.backgroundColor = "#141416";
      return localTheme;
    }
    else return 'light';
  });

  function toggleTheme(){
    let newTheme: 'light' | 'dark' = 'light';
    let body = document.querySelector('body');
    if(theme == 'light'){
      if(body) body.style.backgroundColor = "#141416";
      newTheme = 'dark';
    }
    else{
      if(body) body.style.backgroundColor = "#f8f8f8";
    }
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }
  function btnToggleTheme(){
    return <button
      id="toggle-theme"
      aria-label="Alternar tema"
      title="Alternar tema"
      onClick={toggleTheme}
    >
      {theme == 'light' ? (
        <img src={moonImg} alt="Tema Escuro"/>
      ):(
        <img src={sunImg} alt="Tema Claro"/>
      )}
    </button>
    ;
  }
  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, btnToggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}