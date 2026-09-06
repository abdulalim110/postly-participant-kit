import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../graphql/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('postly_token') || '');
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    skip: !token,
    fetchPolicy: 'network-only',
  });

  const currentUser = data?.me || null;

  const handleLogin = (newToken, user) => {
    localStorage.setItem('postly_token', newToken);
    setToken(newToken);
    refetch();
  };

  const handleLogout = () => {
    localStorage.removeItem('postly_token');
    setToken('');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        loadingUser: loading && !!token,
        login: handleLogin,
        logout: handleLogout,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
