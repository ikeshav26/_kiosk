import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { register401Handler } from '../utils/Instance';

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    setuser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    register401Handler(handleUnauthorized);
  }, [handleUnauthorized]);

  const value = {
    user,
    setuser,
    navigate,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export { authContext, AuthProvider };
