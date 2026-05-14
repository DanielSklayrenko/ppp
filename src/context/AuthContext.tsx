import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'executor' | 'admin';
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  bio?: string;
  skills?: string[];
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: 'customer' | 'executor') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'service_platform_auth';
const USERS_KEY = 'service_platform_users';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  avatar?: string;
  role: 'customer' | 'executor' | 'admin';
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  bio?: string;
  skills?: string[];
  createdAt: string;
}

const loadUsers = (): StoredUser[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    const users = JSON.parse(data);
    return users.map((u: StoredUser) => ({
      ...u,
      createdAt: new Date(u.createdAt).toISOString()
    }));
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const createUser = (name: string, email: string, password: string, role: 'customer' | 'executor'): StoredUser => {
  const passwordHash = bcrypt.hashSync(password, 10);
  return {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name,
    passwordHash,
    role,
    rating: 0,
    reviewsCount: 0,
    completedOrders: 0,
    createdAt: new Date().toISOString()
  };
};

const userToPublic = (stored: StoredUser): User => ({
  id: stored.id,
  email: stored.email,
  name: stored.name,
  avatar: stored.avatar,
  role: stored.role,
  rating: stored.rating,
  reviewsCount: stored.reviewsCount,
  completedOrders: stored.completedOrders,
  bio: stored.bio,
  skills: stored.skills,
  createdAt: new Date(stored.createdAt)
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const session = JSON.parse(stored);
          const users = loadUsers();
          const foundUser = users.find(u => u.id === session.userId);
          if (foundUser && session.expiresAt > Date.now()) {
            setUser(userToPublic(foundUser));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = loadUsers();
      const foundUser = users.find(u => u.email === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'Пользователь с таким email не найден' };
      }

      const isValid = bcrypt.compareSync(password, foundUser.passwordHash);
      if (!isValid) {
        return { success: false, error: 'Неверный пароль' };
      }

      const session = {
        userId: foundUser.id,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(userToPublic(foundUser));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ошибка входа. Попробуйте позже.' };
    }
  };

  const register = async (name: string, email: string, password: string, role: 'customer' | 'executor'): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = loadUsers();
      
      if (users.some(u => u.email === email.toLowerCase())) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
      }

      const newUser = createUser(name, email, password, role);
      users.push(newUser);
      saveUsers(users);

      const session = {
        userId: newUser.id,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(userToPublic(newUser));
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Ошибка регистрации. Попробуйте позже.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { 
        ...users[userIndex], 
        ...updates,
        createdAt: updates.createdAt instanceof Date ? updates.createdAt.toISOString() : users[userIndex].createdAt
      } as StoredUser;
      saveUsers(users);
      setUser({ ...user, ...updates });
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = loadUsers();
      const foundUser = users.find(u => u.email === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'Пользователь с таким email не найден' };
      }

      // В реальном приложении здесь была бы отправка email
      // Для демонстрации создадим временный пароль
      const tempPassword = Math.random().toString(36).slice(-8);
      const newHash = bcrypt.hashSync(tempPassword, 10);
      
      users[users.findIndex(u => u.id === foundUser.id)].passwordHash = newHash;
      saveUsers(users);

      // Сохраним временный пароль в sessionStorage для демонстрации
      sessionStorage.setItem('tempPassword', tempPassword);
      
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Ошибка сброса пароля' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
