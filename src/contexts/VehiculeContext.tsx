import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants';

export type VehiculeContextType = {
  isLoggedIn: boolean;
  token: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const VehiculeContext = createContext<VehiculeContextType>({
  isLoggedIn: false,
  token: '',
  login: () => new Promise(() => false),
  logout: () => {},
});


export default function VehiculeProvider(props: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  //  restaure le token du localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setIsLoggedIn(true);
      setToken(savedToken);
    }
  }, []);

  async function login(email: string, password: string) {
    return axios
      .post(`${API_BASE_URL}/api/auth/generatetoken`, {
        email,
        password,
      })
      .then((response) => {
        const { token } = response.data;
        if (token) {
          setIsLoggedIn(true);
          setToken(token);
          // Sauvegarde le token dans localStorage
          localStorage.setItem('token', token);
          return true;
        } else {
          setIsLoggedIn(false);
          setToken('');
          localStorage.removeItem('token');
          return false;
        }
      });
  }

  function logout() {
    setToken('');
    setIsLoggedIn(false);
    // Supprime le token du localStorage
    localStorage.removeItem('token');
  }

  const values: VehiculeContextType = {
    isLoggedIn,
    token,
    login,
    logout,
  };

  return (
    <VehiculeContext.Provider value={values}>
      {props.children}
    </VehiculeContext.Provider>
  );
}