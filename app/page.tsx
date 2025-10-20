'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MainContent from '@/components/MainContent'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { HistoryProvider } from '@/contexts/HistoryContext'

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <HistoryProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <div className="flex">
                <Sidebar />
                <MainContent />
              </div>
            </div>
          </HistoryProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}