import { useState, useEffect, useCallback } from 'react'
import { AppLayout } from '@/components/layout'
import { RackForm } from '@/components/rack/RackForm'
import { RackResults } from '@/components/rack/RackResults'
import { SetPanel } from '@/components/rack/SetPanel'
import { useMutation, useQuery } from '@tanstack/react-query'
import { rackService } from '@/services/rack.service'
import { rackCalculationSchema } from '@/utils/validation/rack.validation'
import type { RackResult, SpanInput } from '@/types/rack'
import { toast } from 'sonner'
import { useRackSetStore } from '@/stores/rackSet.store'

/**
 * Сторінка калькулятора стелажів
 */
export function RackCalculatorPage() {
  // Завантаження опцій з прайсу
  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ['rackOptions'],
    queryFn: () => rackService.getOptions(),
  })

  // Додавання до комплекту
  const addRackToSet = useRackSetStore((state) => state.addRack)

  const handleAddToSet = useCallback(
    (result: RackResult) => {
      addRackToSet(result)
      toast.success('Стелаж додано до комплекту')
    },
    [addRackToSet]
  )

  // Форма
  const [levels, setLevels] = useState(1)
  const [rows, setRows] = useState(1)
  const [beamsPerRow, setBeamsPerRow] = useState(2)
  const [supportType, setSupportType] = useState('')
  const [verticalStandType, setVerticalStandType] = useState('')
  const [spans, setSpans] = useState<SpanInput[]>([])

  // Результат
  const [result, setResult] = useState<RackResult | null>(null)

  // Ініціалізація значень після завантаження опцій
  useEffect(() => {
    if (options && !supportType && options.supports.length > 0) {
      setSupportType(options.supports[0].value)
    }
  }, [options, supportType])

  // Мутація для розрахунку
  const calculateMutation = useMutation({
    mutationFn: async (data: unknown) => {
      return rackService.calculate(data as Parameters<typeof rackService.calculate>[0])
    },
    onSuccess: (data) => {
      setResult(data)
      toast.success('Розрахунок виконано успішно')
    },
    onError: (error) => {
      toast.error(`Помилка розрахунку: ${error.message}`)
    },
  })

  // Додавання прольоту
  const addSpan = () => {
    const defaultSpan = options?.spans[0]?.value || '600'
    setSpans([...spans, { type: defaultSpan, quantity: 1 }])
  }

  // Видалення прольоту
  const removeSpan = (index: number) => {
    if (spans.length > 1) {
      setSpans(spans.filter((_, i) => i !== index))
    } else {
      setSpans([])
    }
  }

  // Оновлення прольоту
  const updateSpan = (index: number, field: keyof SpanInput, value: string | number) => {
    const newSpans = [...spans]
    newSpans[index] = { ...newSpans[index], [field]: value }
    setSpans(newSpans)
  }

  // Очищення форми
  const handleClear = () => {
    setLevels(1)
    setRows(1)
    setBeamsPerRow(2)
    setSupportType(options?.supports[0]?.value || '')
    setVerticalStandType('')
    setSpans([])
    setResult(null)
  }

  // Розрахунок
  const handleCalculate = () => {
    const data = {
      levels,
      rows,
      beamsPerRow,
      supportType,
      verticalStandType: levels >= 2 ? verticalStandType : undefined,
      spans,
    }

    // Валідація
    const parsed = rackCalculationSchema.safeParse(data)
    if (!parsed.success) {
      toast.error('Перевірте правильність заповнення форми')
      console.error(parsed.error)
      return
    }

    calculateMutation.mutate(data)
  }

  if (optionsLoading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Завантаження параметрів...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Калькулятор стелажів</h1>
            <p className="text-muted-foreground">
              Розрахунок конфігурації та вартості стелажного обладнання
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Форма - ліва колонка */}
          <div className="lg:col-span-4 xl:col-span-3">
            <RackForm
              levels={levels}
              rows={rows}
              beamsPerRow={beamsPerRow}
              supportType={supportType}
              verticalStandType={verticalStandType}
              spans={spans}
              options={options || null}
              onLevelsChange={setLevels}
              onRowsChange={setRows}
              onBeamsPerRowChange={setBeamsPerRow}
              onSupportTypeChange={setSupportType}
              onVerticalStandTypeChange={setVerticalStandType}
              onAddSpan={addSpan}
              onRemoveSpan={removeSpan}
              onUpdateSpan={updateSpan}
              onClear={handleClear}
              onCalculate={handleCalculate}
              isCalculating={calculateMutation.isPending}
              canCalculate={!options || spans.length === 0}
              maxSpans={options?.spans.length}
            />
          </div>

          {/* Права колонка - Результати + Комплект */}
          <div className="space-y-6 lg:col-span-8 xl:col-span-9">
            <RackResults
              result={result}
              isCalculating={calculateMutation.isPending}
              onAddToSet={handleAddToSet}
            />
            <SetPanel />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
