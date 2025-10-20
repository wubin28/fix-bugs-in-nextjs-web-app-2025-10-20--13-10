'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { Settings, LogOut, User } from 'lucide-react'

interface ProfileMenuProps {
  user: {
    id: string
    username: string
    avatar: string
  }
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const { t } = useLanguage()
  const { logout, updateProfile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleSettings = () => {
    setShowSettings(true)
    setIsOpen(false)
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('myProfile')}
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.username}
              </div>
            </div>
            
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <Settings size={16} />
              <span>{t('settings')}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </div>
        )}
      </div>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage()
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: t('passwordsMatch') })
      return
    }

    setIsLoading(true)
    
    try {
      const success = await updateProfile(
        formData.avatar || undefined,
        formData.newPassword || undefined
      )
      
      if (success) {
        onClose()
        setFormData({ avatar: '', newPassword: '', confirmPassword: '' })
        setErrors({})
      }
    } catch (error) {
      setErrors({ submit: '更新失败，请重试' })
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('changeAvatar')}
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={formData.avatar || user?.avatar}
                alt={user?.username}
                className="w-12 h-12 rounded-full"
              />
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="头像URL"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('newPassword')}
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('newPassword')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '保存中...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}