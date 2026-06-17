/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  signOut as fbSignOut, 
  createUserWithEmailAndPassword as fbSignUp,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string) => Promise<any>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = (email: string, pass: string) => {
    return fbSignIn(auth, email, pass);
  };

  const signUp = (email: string, pass: string) => {
    return fbSignUp(auth, email, pass);
  };

  const logOut = () => {
    return fbSignOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signUp,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center bg-[#090d16] text-[#0cf]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-cyan-400 animate-spin"></div>
            </div>
            <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              Initializing Secure Session...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
