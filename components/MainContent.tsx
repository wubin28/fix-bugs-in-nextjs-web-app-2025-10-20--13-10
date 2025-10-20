'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useHistory } from '@/contexts/HistoryContext'
import { HistoryItem } from '@/contexts/HistoryContext'
import { Languages, Moon, Sun, Copy } from 'lucide-react'

export default function MainContent() {
  const { t, toggleLanguage, language } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  const { addHistory } = useHistory()
  
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  // 当选择历史记录时，显示对应的内容
  useEffect(() => {
    if (selectedHistory) {
      setOriginalPrompt(selectedHistory.originalPrompt)
      setOptimizedPrompt(selectedHistory.optimizedPrompt)
    } else {
      setOriginalPrompt('')
      setOptimizedPrompt('')
    }
  }, [selectedHistory])

  const handleNewOptimization = () => {
    setSelectedHistory(null)
    setOriginalPrompt('')
    setOptimizedPrompt('')
  }

  const handleOptimize = async () => {
    if (!originalPrompt.trim()) {
      alert(t('promptRequired'))
      return
    }

    setIsOptimizing(true)
    setIsStreaming(true)

    try {
      // 首先尝试智能优化模式（DeepSeek API）
      const smartPrompt = await optimizeWithDeepSeek(originalPrompt)
      
      if (smartPrompt) {
        setOptimizedPrompt(smartPrompt)
        
        // 保存到历史记录
        if (isAuthenticated) {
          const title = originalPrompt.length > 30 ? 
            originalPrompt.slice(0, 30) + '...' : originalPrompt
          
          addHistory({
            title,
            originalPrompt,
            optimizedPrompt: smartPrompt,
            isSmartMode: true
          })
        }
      } else {
        // 如果智能模式失败，使用基础模式
        const basicPrompt = optimizeWithBasicMode(originalPrompt)
        setOptimizedPrompt(basicPrompt)
        
        if (isAuthenticated) {
          const title = originalPrompt.length > 30 ? 
            originalPrompt.slice(0, 30) + '...' : originalPrompt
          
          addHistory({
            title,
            originalPrompt,
            optimizedPrompt: basicPrompt,
            isSmartMode: false
          })
        }
      }
    } catch (error) {
      console.error('优化失败:', error)
      // 使用基础模式作为备用
      const basicPrompt = optimizeWithBasicMode(originalPrompt)
      setOptimizedPrompt(basicPrompt)
      
      if (isAuthenticated) {
        const title = originalPrompt.length > 30 ? 
          originalPrompt.slice(0, 30) + '...' : originalPrompt
        
        addHistory({
          title,
          originalPrompt,
          optimizedPrompt: basicPrompt,
          isSmartMode: false
        })
      }
    } finally {
      setIsOptimizing(false)
      setIsStreaming(false)
    }
  }

  const optimizeWithBasicMode = (prompt: string): string => {
    return `你是专家。${prompt}。请提供主要观点的网页链接，以便核实。如遇不确定信息，请如实告知，不要编造。`
  }

  const optimizeWithDeepSeek = async (prompt: string): Promise<string | null> => {
    // 模拟DeepSeek API调用
    // 在实际应用中，这里应该调用真实的DeepSeek API
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟智能优化逻辑
        const optimized = `你是人工智能领域的专家，${prompt}。请提供相关信息的官方网站或权威评测链接以便核实。如遇不确定信息，请如实告知，不要编造。`
        resolve(optimized)
      }, 2000)
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt)
      // 可以添加复制成功的提示
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  return (
    <div className="flex-1 p-8">
      {/* 顶部工具栏 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('aiPromptOptimizer')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleLanguage}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={language === 'en' ? '切换到中文' : 'Switch to English'}
          >
            <Languages size={20} />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'light' ? '切换到深色模式' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 原始提示词输入区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <label htmlFor="original-prompt" className="text-lg font-medium text-gray-900 dark:text-white">
              {t('yourPrompt')}
            </label>
            <span className="text-red-500 ml-1">*</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {t('required')}
            </span>
          </div>
          
          <input
            type="text"
            id="original-prompt"
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            placeholder={t('placeholder')}
            disabled={!!selectedHistory}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || !!selectedHistory || !originalPrompt.trim()}
            className="w-full mt-4 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isOptimizing ? '优化中...' : t('optimizePrompt')}
          </button>
        </div>

        {/* 优化后的提示词显示区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('optimizedPrompt')}
            </h3>
            
            {optimizedPrompt && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                <Copy size={16} />
                <span>{t('copy')}</span>
              </button>
            )}
          </div>
          
          <div className="min-h-[120px] p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            {isStreaming ? (
              <div className="text-gray-600 dark:text-gray-400">
                <div className="typewriter">
                  {optimizedPrompt || '正在生成优化后的提示词...'}
                </div>
              </div>
            ) : optimizedPrompt ? (
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {optimizedPrompt}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {t('defaultResult')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}