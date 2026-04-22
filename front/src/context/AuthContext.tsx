import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
      if (user.id) localStorage.setItem('user_id', String(user.id));
      if (user.role) localStorage.setItem('user_role', user.role);
    } else {
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      logout,
      isAuthenticated: !!user, 
      isLoading 
    }}>
      {!isLoading ? children : (
        <div className="h-screen w-screen bg-[#0b101f] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};