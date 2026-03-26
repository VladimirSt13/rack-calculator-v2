import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus } from 'lucide-react'
import { ClearButton } from '@/components/ui/ClearButton'
import { FormField } from './FormField'
import type { SpanInput } from '@/types/rack'
import type { RackOptions } from '@/services/rack.service'

interface RackFormProps {
  levels: number
  rows: number
  beamsPerRow: number
  supportType: string
  verticalStandType: string
  spans: SpanInput[]
  options: RackOptions | null
  onLevelsChange: (value: number) => void
  onRowsChange: (value: number) => void
  onBeamsPerRowChange: (value: number) => void
  onSupportTypeChange: (value: string) => void
  onVerticalStandTypeChange: (value: string) => void
  onAddSpan: () => void
  onRemoveSpan: (index: number) => void
  onUpdateSpan: (index: number, field: keyof SpanInput, value: string | number) => void
  onClear: () => void
  onCalculate: () => void
  isCalculating: boolean
  canCalculate: boolean
  maxSpans?: number // Максимальна кількість прольотів
}

export function RackForm({
  levels,
  rows,
  beamsPerRow,
  supportType,
  verticalStandType,
  spans,
  options,
  onLevelsChange,
  onRowsChange,
  onBeamsPerRowChange,
  onSupportTypeChange,
  onVerticalStandTypeChange,
  onAddSpan,
  onRemoveSpan,
  onUpdateSpan,
  onClear,
  onCalculate,
  isCalculating,
  canCalculate,
  maxSpans,
}: RackFormProps) {
  return (
    <Card className="w-full max-w-87.5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Параметри стелажа</CardTitle>
          <ClearButton onClick={onClear} />
        </div>
        <CardDescription>Введіть конфігурацію стелажа для розрахунку</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Секція: Геометрія */}
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Геометрія
          </h3>

          {/* Кількість поверхів */}
          <FormField label="Рівні" labelId="levels">
            <Input
              id="levels"
              type="number"
              min={1}
              max={10}
              value={levels}
              onChange={(e) => onLevelsChange(Number(e.target.value))}
              className="w-20 font-mono"
            />
          </FormField>

          {/* Вертикальна опора (disabled якщо 1 поверх) */}
          <FormField label="Верт. опора" labelId="vertical">
            <Select
              value={verticalStandType}
              onValueChange={(v) => onVerticalStandTypeChange(v ?? '')}
              disabled={levels === 1}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder={levels === 1 ? '---' : 'Оберіть...'} />
              </SelectTrigger>
              <SelectContent>
                {options?.verticalStands.map((stand) => (
                  <SelectItem key={stand.value} value={stand.value}>
                    {stand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Опора */}
          <FormField label="Опора" labelId="support">
            <Select value={supportType} onValueChange={(v) => onSupportTypeChange(v ?? '')}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Оберіть..." />
              </SelectTrigger>
              <SelectContent>
                {options?.supports.map((support) => (
                  <SelectItem key={support.value} value={support.value}>
                    {support.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Кількість рядів */}
          <FormField label="Ряди" labelId="rows">
            <Input
              id="rows"
              type="number"
              min={1}
              max={4}
              value={rows}
              onChange={(e) => onRowsChange(Number(e.target.value))}
              className="w-20 font-mono"
            />
          </FormField>

          {/* Балок у ряду */}
          <FormField label="Балки на один ряд" labelId="beams">
            <Input
              id="beams"
              type="number"
              min={2}
              max={4}
              value={beamsPerRow}
              onChange={(e) => onBeamsPerRowChange(Number(e.target.value))}
              className="w-20 font-mono"
            />
          </FormField>
        </div>

        <Separator />

        {/* Секція: Прольоти */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onAddSpan}
                className="h-8"
                disabled={maxSpans !== undefined && spans.length >= maxSpans}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground text-sm">Додати проліт</span>
            </div>
            {maxSpans !== undefined && (
              <span className="text-muted-foreground text-xs">
                {spans.length} / {maxSpans}
              </span>
            )}
          </div>

          {/* Список прольотів */}
          {spans.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Немає доданих прольотів
            </p>
          ) : (
            <div className="space-y-2">
              {spans.map((span, index) => (
                <div
                  key={index}
                  className="bg-card grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-md border p-2.5"
                >
                  <Select
                    value={span.type}
                    onValueChange={(v) => onUpdateSpan(index, 'type', v ?? '')}
                  >
                    <SelectTrigger className="h-8 min-w-30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.spans.map((spanType) => (
                        <SelectItem key={spanType.value} value={spanType.value}>
                          {spanType.label} мм
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min={1}
                    value={span.quantity}
                    onChange={(e) => onUpdateSpan(index, 'quantity', Number(e.target.value))}
                    className="h-8 w-18 text-center font-mono"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveSpan(index)}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <Button
          className="w-full"
          onClick={onCalculate}
          disabled={isCalculating || !options || spans.length === 0}
        >
          {isCalculating ? 'Розрахунок...' : 'Розрахувати'}
        </Button>
      </CardContent>
    </Card>
  )
}
