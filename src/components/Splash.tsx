import wallpaper from '../assets/images/wallpaper.png';

export function Splash() {
  return (
    <img src={wallpaper} alt="NLW Together" style={{
      objectFit: 'cover',
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }}/>
  );
}