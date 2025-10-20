export interface PromptValidationResult {
  isValid: boolean;
  message?: string;
  charCount: number;
  exceedingText?: string;
}

export interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange: (validation: PromptValidationResult) => void;
  maxLength?: number;
  hardLimit?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}