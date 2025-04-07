
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface UserData {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log('User authenticated:', currentSession.user.email);
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: currentSession.user.user_metadata?.username || currentSession.user.email?.split('@')[0] || '',
          });
        } else {
          console.log('No user authenticated');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        console.log('Checking for existing session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          console.log('Found existing session:', currentSession.user.id);
          setSession(currentSession);
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: currentSession.user.user_metadata?.username || currentSession.user.email?.split('@')[0] || '',
          });
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error from Supabase:', error);
        throw error;
      }
      
      console.log('Login successful:', data.user?.email);
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting signup with email:', email);
      
      // Use signUp with email verification (but we'll also sign in right after)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (signUpError) {
        console.error('Signup error from Supabase:', signUpError);
        throw signUpError;
      }
      
      console.log('Signup response:', signUpData);
      
      // Auto-login after signup
      console.log('Auto-logging in after signup');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error('Auto-login error after signup:', signInError);
        throw signInError;
      }
      
      console.log('Auto-login successful after signup');
      toast.success('Account created and logged in successfully');
    } catch (error) {
      console.error('Signup or auto-login error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Logout successful');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
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
