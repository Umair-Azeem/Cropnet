import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/lib/api';
// import { useNavigate } from "react-router-dom";
import axios from "axios"

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'customer' | 'admin';
  location: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  location: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // const response = await apiService.login(email, password);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      })

      // if (response.error) {
      //   throw new Error(response.error);
      // }

      if (response.data) {
        console.log("response.data=>", response.data)
        // const { token: authToken, user: userData } = response.data as AuthResponse;

        // setToken(authToken);
        setUser(response.data.user);

        // if (response.data.user.role == 'admin') {
        //   navigate("/admin");
        // }

        // localStorage.setItem('token', authToken);
        // localStorage.setItem('user', JSON.stringify(userData));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      // const response = await apiService.register(name, email, password, role);
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role
      })

      // if (response.error) {
      //   throw new Error(response.error);
      // }

      if (response.data) {
        console.log("[AuthContext.tsx] register -> response.data =>", response.data)
        // const { token: authToken, user: userData } = response.data as AuthResponse;

        // setToken(authToken);
        setUser(response.data.user);

        // localStorage.setItem('token', authToken);
        // localStorage.setItem('user', JSON.stringify(userData));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    loading,
    location: " "
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 