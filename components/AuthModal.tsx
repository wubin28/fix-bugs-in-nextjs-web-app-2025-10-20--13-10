'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { X } from 'lucide-react'

interface AuthModalProps {
  mode: 'login' | 'register'
  onClose: () => void
  onSwitchMode: () => void
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const { t } = useLanguage()
  const { login, register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = t('usernameRequired')
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired')
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      let success = false
      if (mode === 'login') {
        success = await login(formData.username, formData.password)
      } else {
        success = await register(formData.username, formData.password)
      }

      if (success) {
        onClose()
        setFormData({ username: '', password: '', confirmPassword: '' })
        setErrors({})
      } else {
        setErrors({ submit: mode === 'login' ? '登录失败' : '注册失败' })
      }
    } catch (error) {
      setErrors({ submit: '发生错误，请重试' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'login' ? t('signIn') : t('signUp')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('username')}
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('username')}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '处理中...' : (mode === 'login' ? t('signIn') : t('signUp'))}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onSwitchMode}
            className="text-primary-500 hover:text-primary-600 text-sm"
          >
            {mode === 'login' ? t('signUp') : t('signIn')}
          </button>
        </div>
      </div>
    </div>
  )
}