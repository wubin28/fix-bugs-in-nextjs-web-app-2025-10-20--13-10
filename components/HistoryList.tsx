'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useHistory } from '@/contexts/HistoryContext'
import { HistoryItem } from '@/contexts/HistoryContext'
import { Edit2, Trash2 } from 'lucide-react'

interface HistoryListProps {
  today: HistoryItem[]
  yesterday: HistoryItem[]
  older: HistoryItem[]
  selectedHistory: HistoryItem | null
  onSelectHistory: (item: HistoryItem) => void
}

export default function HistoryList({
  today,
  yesterday,
  older,
  selectedHistory,
  onSelectHistory
}: HistoryListProps) {
  const { t } = useLanguage()
  const { updateHistoryTitle, deleteHistory } = useHistory()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleEditStart = (item: HistoryItem) => {
    setEditingId(item.id)
    setEditTitle(item.title)
  }

  const handleEditSave = (id: string) => {
    if (editTitle.trim()) {
      updateHistoryTitle(id, editTitle)
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const handleDelete = (item: HistoryItem) => {
    if (window.confirm(`${t('deleteConfirm')} "${item.title}"`)) {
      deleteHistory(item.id)
    }
  }

  const renderHistoryGroup = (title: string, items: HistoryItem[]) => {
    if (items.length === 0) return null

    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedHistory?.id === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              onClick={() => onSelectHistory(item)}
            >
              <div className="flex items-center justify-between">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSave(item.id)
                      if (e.key === 'Escape') handleEditCancel()
                    }}
                    onBlur={() => handleEditSave(item.id)}
                    className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500"
                    autoFocus
                  />
                ) : (
                  <>
                    <span 
                      className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]"
                      title={item.title.length > 16 ? item.title : undefined}
                    >
                      {item.title.length > 16 ? item.title.slice(0, 16) + '...' : item.title}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditStart(item)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item)
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {item.title.length > 16 && (
                <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-10">
                  <div className="bg-black text-white text-xs px-2 py-1 rounded max-w-xs">
                    {item.title.slice(0, 30)}{item.title.length > 30 ? '...' : ''}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-2">
      {renderHistoryGroup(t('today'), today)}
      {renderHistoryGroup(t('yesterday'), yesterday)}
      {renderHistoryGroup(t('older'), older)}
    </div>
  )
}