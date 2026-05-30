'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { loginSchema, getValidationErrors } from '@/lib/validation/schemas';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  isLoadingLogin: boolean;
}

// Tipo interno para usuarios con hash (seguro)
interface UserWithHash extends User {
  hash: string;
}

// Cargar usuarios desde archivo JSON (solución alternativa a variables de entorno)
const loadUsers = (): UserWithHash[] => {
  try {
    // Importar usuarios desde archivo JSON
    const usersData = require('@/lib/data/users.json');
    console.log('🔍 DEBUG: Cargando usuarios desde archivo JSON');
    console.log('✅ DEBUG: Usuarios cargados:', usersData.length, 'usuarios');
    console.log('📧 DEBUG: Emails disponibles:', usersData.map((u: any) => u.email));

    // Verificar cada usuario y su hash
    usersData.forEach((u: any, index: number) => {
      console.log(`👤 DEBUG: Usuario ${index + 1}:`, u.email);
      console.log(`🔒 DEBUG: Hash ${index + 1}:`, u.hash);
      console.log(`🔒 DEBUG: Hash ${index + 1} longitud:`, u.hash.length);
      console.log(`🔒 DEBUG: Hash ${index + 1} formato:`, u.hash.substring(0, 7));
    });

    return usersData;
  } catch (error) {
    console.error('❌ Error al cargar usuarios desde archivo JSON:', error);
    console.error('Intentando fallback a variables de entorno...');

    // Fallback a variables de entorno
    try {
      const usersEnv = process.env.NEXT_PUBLIC_USERS;
      if (!usersEnv) {
        console.error('❌ NEXT_PUBLIC_USERS no está definido');
        return [];
      }
      const parsedUsers = JSON.parse(usersEnv);
      console.log('✅ DEBUG: Usuarios cargados desde variables de entorno:', parsedUsers.length);
      return parsedUsers;
    } catch (envError) {
      console.error('❌ Error en fallback a variables de entorno:', envError);
      return [];
    }
  }
};

const USERS = loadUsers();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('amere-user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            localStorage.removeItem('amere-user');
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. Unable to access user data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 DEBUG: Login iniciado con email:', email);
    setIsLoadingLogin(true);

    try {
      // Validar formato de email y contraseña con Zod
      const loginData = loginSchema.parse({ email, password });
      console.log('✅ DEBUG: Validación Zod exitosa');
    } catch (error) {
      console.error('❌ DEBUG: Error de validación Zod:', error);
      setIsLoadingLogin(false);
      return false;
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🔍 DEBUG: Buscando usuario con email:', email.toLowerCase());
    console.log('📚 DEBUG: Usuarios disponibles:', USERS.length);

    // Buscar usuario por email
    const foundUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      console.error('❌ DEBUG: Usuario no encontrado');
      setIsLoadingLogin(false);
      return false;
    }

    console.log('✅ DEBUG: Usuario encontrado:', foundUser.email);
    console.log('🔒 DEBUG: Hash del usuario:', foundUser.hash.substring(0, 10) + '...');
    console.log('🔒 DEBUG: Hash completa:', foundUser.hash);
    console.log('🔒 DEBUG: Longitud de hash:', foundUser.hash.length);
    console.log('🔒 DEBUG: Contraseña a verificar:', password);
    console.log('🔒 DEBUG: Longitud de contraseña:', password.length);

    try {
      // Verificar contraseña usando bcrypt
      console.log('🔐 DEBUG: Verificando contraseña con bcrypt...');

      // Primero verifiquemos que la hash tenga el formato correcto
      if (!foundUser.hash.startsWith('$2') || !foundUser.hash.includes('$')) {
        console.error('❌ DEBUG: Formato de hash inválido');
        setIsLoadingLogin(false);
        return false;
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.hash);

      console.log('🔐 DEBUG: Contraseña válida:', isPasswordValid);

      if (!isPasswordValid) {
        console.error('❌ DEBUG: Contraseña incorrecta');
        setIsLoadingLogin(false);
        return false;
      }

      // Crear objeto de usuario sin hash
      const userWithoutHash: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };

      console.log('✅ DEBUG: Usuario autenticado correctamente:', userWithoutHash.email);
      setUser(userWithoutHash);

      try {
        localStorage.setItem('amere-user', JSON.stringify(userWithoutHash));
        console.log('✅ DEBUG: Usuario guardado en localStorage');
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. User will not persist across sessions.');
        }
        // Continue even if localStorage fails - user is still set in state
      }

      // También guardar en cookie para middleware
      document.cookie = 'amere-user=true; path=/; max-age=86400'; // 24 horas
      console.log('✅ DEBUG: Cookie establecida');

      setIsLoadingLogin(false);
      console.log('🎉 DEBUG: Login completado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ DEBUG: Error al verificar contraseña:', error);
      setIsLoadingLogin(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);

    try {
      localStorage.removeItem('amere-user');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
      // Continue anyway - user is already cleared from state
    }

    try {
      document.cookie = 'amere-user=; path=/; max-age=0'; // Eliminar cookie
    } catch (error) {
      console.error('Error clearing cookie:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor' || user?.role === 'admin',
    isLoading,
    isLoadingLogin,
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Exportar usuarios para referencia (solo para desarrollo - sin hashes)
export const getCredentials = () => {
  return USERS.map(u => ({
    email: u.email,
    name: u.name,
    role: u.role,
  }));
};
