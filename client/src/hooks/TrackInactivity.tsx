import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useInactivityTimer(timeout = 1000 * 60 * 10) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        navigate('/');
      }, timeout);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeout]);
}
