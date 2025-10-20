'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (avatar?: string, newPassword?: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // 模拟登录逻辑
    if (username && password) {
      const userData: User = {
        id: Date.now().toString(),
        username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=3b82f6&color=fff`
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    // 模拟注册逻辑
    if (username && password) {
      const userData: User = {
        id: Date.now().toString(),
        username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=10b981&color=fff`
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = async (avatar?: string, newPassword?: string): Promise<boolean> => {
    if (user) {
      const updatedUser = {
        ...user,
        avatar: avatar || user.avatar
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}