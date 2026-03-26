import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  value: number | undefined
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  variant?: 'default' | 'success' | 'muted'
  showCurrency?: boolean
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

const variantClasses = {
  default: 'text-foreground',
  success: 'text-green-600 font-semibold',
  muted: 'text-muted-foreground',
}

/**
 * Компонент для відображення цін з форматуванням
 */
export function PriceDisplay({
  value,
  className,
  size = 'base',
  variant = 'default',
  showCurrency = true,
}: PriceDisplayProps) {
  // Захист від undefined/null
  const safeValue = value ?? 0

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {safeValue.toLocaleString('uk-UA')}
      {showCurrency && ' ₴'}
    </span>
  )
}
