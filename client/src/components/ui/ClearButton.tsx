import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ClearButtonProps {
  onClick: () => void
  className?: string
  disabled?: boolean
}

/**
 * Кнопка очищення форми/списку
 * Універсальний компонент для кнопок з іконкою X і текстом "Очистити"
 */
export function ClearButton({ onClick, className = '', disabled = false }: ClearButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className={`text-muted-foreground ${className}`}
    >
      <X className="mr-1 h-3 w-3" />
      Очистити
    </Button>
  )
}
