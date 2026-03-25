import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  labelId: string;
  children: ReactNode;
  labelWidth?: string;
}

/**
 * Универсальный компонент поля формы
 * Layout: label (слева) | input/select (справа)
 */
export function FormField({
  label,
  labelId,
  children,
  labelWidth = '100px',
}: FormFieldProps) {
  return (
    <div className={`grid grid-cols-[${labelWidth}_1fr] items-center gap-2`}>
      <Label htmlFor={labelId} className="justify-self-start">
        {label}
      </Label>
      {children}
    </div>
  );
}
