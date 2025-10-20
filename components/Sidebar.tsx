'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useHistory } from '@/contexts/HistoryContext'
import { HistoryItem } from '@/contexts/HistoryContext'
import AuthModal from './AuthModal'
import ProfileMenu from './ProfileMenu'
import HistoryList from './HistoryList'

export default function Sidebar() {
  const { t } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const { getHistoryByDate } = useHistory()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)

  const handleNewOptimization = () => {
    setSelectedHistory(null)
    // 这里可以添加清空主内容区的逻辑
  }

  const handleSignIn = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const { today, yesterday, older } = getHistoryByDate()

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* 顶部应用名称 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('appName')}
        </h1>
      </div>

      {/* 新优化按钮 */}
      <div className="p-4">
        <button
          onClick={handleNewOptimization}
          className="w-full bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {t('newOptimization')}
        </button>
      </div>

      {/* 历史记录区域 */}
      <div className="flex-1 overflow-y-auto">
        {isAuthenticated ? (
          <HistoryList 
            today={today}
            yesterday={yesterday}
            older={older}
            selectedHistory={selectedHistory}
            onSelectHistory={setSelectedHistory}
          />
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {t('noHistory')}
          </div>
        )}
      </div>

      {/* 底部认证区域 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {isAuthenticated ? (
          <ProfileMenu user={user!} />
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSignIn}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('signIn')}
            </button>
            <button
              onClick={handleSignUp}
              className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              {t('signUp')}
            </button>
          </div>
        )}
      </div>

      {/* 认证模态框 */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </div>
  )
}