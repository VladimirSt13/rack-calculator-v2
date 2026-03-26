import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  label: string
  labelId: string
  children: ReactNode
  labelWidth?: string
}

/**
 * Універсальний компонент поля форми
 * Layout: label (зліва) ... input/select (справа)
 */
export function FormField({ label, labelId, children, labelWidth = '100px' }: FormFieldProps) {
  return (
    <div className="flex items-baseline gap-1">
      <Label htmlFor={labelId} className="shrink-0 text-right">
        {label}
      </Label>
      <div className="border-muted-foreground flex-1 border-b border-dotted" />
      <div className="shrink-0" style={{ width: labelWidth, minWidth: labelWidth }}>
        {children}
      </div>
    </div>
  )
}
