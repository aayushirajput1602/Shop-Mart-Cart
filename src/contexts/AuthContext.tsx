
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('ecommerce-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll use a mock implementation
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hardcoded users for demo - in real app, this would be validated on the backend
      const validUsers = [
        { id: '1', username: 'user1', email: 'user1@example.com', password: 'password123' },
        { id: '2', username: 'user2', email: 'user2@example.com', password: 'password123' },
        { id: '3', username: 'admin', email: 'admin@example.com', password: 'admin123' }
      ];
      
      const foundUser = validUsers.find(u => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem('ecommerce-user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      toast.success('Login successful');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register a new user
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email
      };
      
      // Store in localStorage
      localStorage.setItem('ecommerce-user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('ecommerce-user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
