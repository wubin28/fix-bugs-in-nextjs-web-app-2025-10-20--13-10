'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface HistoryItem {
  id: string
  title: string
  originalPrompt: string
  optimizedPrompt: string
  timestamp: number
  isSmartMode: boolean
}

interface HistoryContextType {
  history: HistoryItem[]
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void
  updateHistoryTitle: (id: string, newTitle: string) => void
  deleteHistory: (id: string) => void
  getHistoryByDate: () => {
    today: HistoryItem[]
    yesterday: HistoryItem[]
    older: HistoryItem[]
  }
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('promptHistory')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        localStorage.removeItem('promptHistory')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(history))
  }, [history])

  const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    setHistory(prev => [newItem, ...prev])
  }

  const updateHistoryTitle = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, title: newTitle } : item
    ))
  }

  const deleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const getHistoryByDate = () => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000

    return {
      today: history.filter(item => item.timestamp >= todayStart),
      yesterday: history.filter(item => item.timestamp >= yesterdayStart && item.timestamp < todayStart),
      older: history.filter(item => item.timestamp < yesterdayStart)
    }
  }

  return (
    <HistoryContext.Provider value={{
      history,
      addHistory,
      updateHistoryTitle,
      deleteHistory,
      getHistoryByDate
    }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}