/**
 * 计算文本中的汉字数量
 * @param text 要计算的文本
 * @returns 汉字数量
 */
export const countChineseChars = (text: string): number => {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return (chineseChars || []).length;
};

/**
 * 计算文本的总字数（汉字算一个字，其他字符也算一个字）
 * @param text 要计算的文本
 * @returns 总字数
 */
export const countTotalChars = (text: string): number => {
  const chineseCount = countChineseChars(text);
  const nonChineseCount = text.replace(/[\u4e00-\u9fa5]/g, '').length;
  return chineseCount + nonChineseCount;
};

/**
 * 将超出限制的文本截断，保留指定长度
 * @param text 要截断的文本
 * @param limit 长度限制
 * @returns 截断后的文本
 */
export const truncateText = (text: string, limit: number): string => {
  let currentLength = 0;
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 汉字计数加1，其他字符也计数加1
    currentLength += /[\u4e00-\u9fa5]/.test(char) ? 1 : 1;
    
    if (currentLength <= limit) {
      result += char;
    } else {
      break;
    }
  }
  
  return result;
};