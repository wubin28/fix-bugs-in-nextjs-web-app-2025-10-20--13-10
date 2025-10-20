'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { countTotalChars, truncateText } from '@/utils/textUtils';
import { PromptTextareaProps } from '@/types/prompt';

export default function PromptTextarea({
  value,
  onChange,
  onValidChange,
  maxLength = 1000,
  hardLimit = 1050,
  placeholder,
  className = '',
  disabled = false,
}: PromptTextareaProps) {
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateText = (text: string) => {
    const charCount = countTotalChars(text);
    const isValid = charCount <= maxLength;
    const exceedingText = charCount > maxLength ? text.slice(maxLength) : '';

    return {
      isValid,
      charCount,
      exceedingText,
      message: charCount > maxLength ? t('promptTooLong') : undefined
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    
    // 如果超过硬限制，自动截断
    if (countTotalChars(newValue) > hardLimit) {
      newValue = truncateText(newValue, hardLimit);
    }
    
    onChange(newValue);
    
    // 验证并通知父组件
    const validation = validateText(newValue);
    onValidChange(validation);
  };

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const validation = validateText(value);
  const isExceeding = validation.charCount > maxLength;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full min-h-[100px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 
          ${isExceeding ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-700'} 
          dark:text-white resize-none ${className}`}
      />
      
      {/* 字数统计 */}
      <div className={`absolute bottom-2 right-2 text-sm 
        ${isExceeding ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
        {validation.charCount}/{maxLength}字
      </div>

      {/* 超出警告 */}
      {isExceeding && (
        <div className="mt-1 text-sm text-red-500">
          {t('warningMessage')}
        </div>
      )}
    </div>
  );
}