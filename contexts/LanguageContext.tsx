'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface LanguageContextType {
  language: 'en' | 'zh'
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Sidebar
    'appName': 'Promptyoo-1',
    'newOptimization': 'New optimization',
    'noHistory': 'No history yet',
    'signIn': 'Sign in',
    'signUp': 'Sign up',
    'today': 'Today',
    'yesterday': 'Yesterday',
    'older': 'Older',
    
    // Main content
    'aiPromptOptimizer': 'AI Prompt Optimizer',
    'subtitle': 'Start from a line. Create high-quality AI prompts with ease.',
    'yourPrompt': 'Your prompt to be optimized',
    'required': 'required',
    'placeholder': 'e.g. \'recommend me some prompt optimization tools\'',
    'optimizePrompt': 'Optimize prompt',
    'optimizedPrompt': 'Optimized prompt',
    'copy': 'Copy',
    'defaultResult': 'Your Optimized prompt will be displayed here. Optimize your prompt now!',
    
    // Auth
    'username': 'Username',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'myProfile': 'My profile',
    'settings': 'Settings',
    'logout': 'Log out',
    'changeAvatar': 'Change Avatar',
    'newPassword': 'New Password',
    'save': 'Save',
    
    // History
    'deleteConfirm': 'Are you sure you want to delete?',
    'yes': 'Yes',
    'no': 'No',
    
    // Errors
    'usernameRequired': 'Username is required',
    'passwordRequired': 'Password is required',
    'passwordsMatch': 'Passwords must match',
    'promptRequired': 'Prompt is required',
  },
  zh: {
    // Sidebar
    'appName': 'Promptyoo-1',
    'newOptimization': '新优化',
    'noHistory': '暂无历史记录',
    'signIn': '登录',
    'signUp': '注册',
    'today': '今天',
    'yesterday': '昨天',
    'older': '更早',
    
    // Main content
    'aiPromptOptimizer': 'AI提示词优化器',
    'subtitle': '从一行开始。轻松创建高质量的AI提示词。',
    'yourPrompt': '待优化的提示词',
    'required': '必填',
    'placeholder': '例如："请为我推荐几个提示词优化工具"',
    'optimizePrompt': '优化提示词',
    'optimizedPrompt': '优化后的提示词',
    'copy': '复制',
    'defaultResult': '您的优化提示词将显示在这里。现在就开始优化吧！',
    
    // Auth
    'username': '用户名',
    'password': '密码',
    'confirmPassword': '确认密码',
    'myProfile': '我的资料',
    'settings': '设置',
    'logout': '退出登录',
    'changeAvatar': '更换头像',
    'newPassword': '新密码',
    'save': '保存',
    
    // History
    'deleteConfirm': '是否删除？',
    'yes': '是',
    'no': '否',
    
    // Errors
    'usernameRequired': '用户名不能为空',
    'passwordRequired': '密码不能为空',
    'passwordsMatch': '密码必须一致',
    'promptRequired': '提示词不能为空',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'zh'>('en')

  useEffect(() => {
    const saved = localStorage.getItem('language')
    if (saved === 'en' || saved === 'zh') {
      setLanguage(saved)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}