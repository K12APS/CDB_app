import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({
  userName: '',
  isLogged: false,
  emailVerified: false,
  setUserName: (name: string) => {},
  setIsLogged: (value: boolean) => {},
  setEmailVerified: (value: boolean) => {},
  reloadUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState('');
  const [isLogged, setIsLoggedState] = useState(false);
  const [emailVerified, setEmailVerifiedState] = useState(true);

  const setIsLogged = async (value: boolean) => {
    setIsLoggedState(value);
    await AsyncStorage.setItem('isLogged', JSON.stringify(value));
  };

  const setEmailVerified = async (value: boolean) => {
    setEmailVerifiedState(value);
    await AsyncStorage.setItem('emailVerified', JSON.stringify(value));
  };

  const reloadUser = async () => {
    const name = await AsyncStorage.getItem('userName');
    const logged = await AsyncStorage.getItem('isLogged');

    setUserName(name || 'Accedi/registrati');
    setIsLoggedState(logged === 'true');
  };

  useEffect(() => {
    reloadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ userName, isLogged, emailVerified, setUserName, setIsLogged, setEmailVerified, reloadUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
