import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus, Save, Calculator, X } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { rackService, type RackOptions } from '@/services/rack.service'
import { rackCalculationSchema } from '@/utils/validation/rack.validation'
import type { RackResult, SpanInput } from '@/types/rack'
import { toast } from 'sonner'

/**
 * Страница калькулятора стеллажей
 */
export function RackCalculatorPage() {
  // Загрузка опций из прайса
  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ['rackOptions'],
    queryFn: () => rackService.getOptions(),
  })

  // Форма
  const [levels, setLevels] = useState(1)
  const [rows, setRows] = useState(1)
  const [beamsPerRow, setBeamsPerRow] = useState(2)
  const [supportType, setSupportType] = useState('')
  const [verticalStandType, setVerticalStandType] = useState('')
  const [spans, setSpans] = useState<SpanInput[]>([])

  // Результат
  const [result, setResult] = useState<RackResult | null>(null)

  // Инициализация значений после загрузки опций
  useEffect(() => {
    if (options && !supportType && options.supports.length > 0) {
      setSupportType(options.supports[0].value)
    }
  }, [options])

  // Мутация для расчёта
  const calculateMutation = useMutation({
    mutationFn: async (data: unknown) => {
      return rackService.calculate(data as Parameters<typeof rackService.calculate>[0])
    },
    onSuccess: (data) => {
      setResult(data)
      toast.success('Расчёт выполнен успешно')
    },
    onError: (error) => {
      toast.error(`Ошибка расчёта: ${error.message}`)
    },
  })

  // Добавление пролёта
  const addSpan = () => {
    const defaultSpan = options?.spans[0]?.value || '600'
    setSpans([...spans, { type: defaultSpan, quantity: 1 }])
  }

  // Удаление пролёта
  const removeSpan = (index: number) => {
    if (spans.length > 1) {
      setSpans(spans.filter((_, i) => i !== index))
    } else {
      setSpans([])
    }
  }

  // Обновление пролёта
  const updateSpan = (index: number, field: keyof SpanInput, value: string | number) => {
    const newSpans = [...spans]
    newSpans[index] = { ...newSpans[index], [field]: value }
    setSpans(newSpans)
  }

  // Очистка формы
  const handleClear = () => {
    setLevels(1)
    setRows(1)
    setBeamsPerRow(2)
    setSupportType(options?.supports[0]?.value || '')
    setVerticalStandType('')
    setSpans([])
    setResult(null)
  }

  // Расчёт
  const handleCalculate = () => {
    const data = {
      levels,
      rows,
      beamsPerRow,
      supportType,
      verticalStandType: levels >= 2 ? verticalStandType : undefined,
      spans,
    }

    // Валидация
    const parsed = rackCalculationSchema.safeParse(data)
    if (!parsed.success) {
      toast.error('Проверьте правильность заполнения формы')
      console.error(parsed.error)
      return
    }

    calculateMutation.mutate(data)
  }

  // Сохранение результата
  const handleSave = () => {
    if (result?.rackSetId) {
      toast.success(`Стеллаж сохранён (ID: ${result.rackSetId})`)
    } else {
      toast.info('Для сохранения необходимо авторизоваться')
    }
  }

  if (optionsLoading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Загрузка параметров...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Калькулятор стеллажей</h1>
            <p className="text-muted-foreground">
              Расчёт конфигурации и стоимости стеллажного оборудования
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Форма */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Параметры стеллажа</CardTitle>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleClear}
                  className="text-muted-foreground text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Очистить
                </Button>
              </div>
              <CardDescription>Введите конфигурацию стеллажа для расчёта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Секция: Геометрия */}
              <div className="space-y-4">
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Геометрия
                </h3>

                {/* Количество этажей */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label htmlFor="levels" className="justify-self-start">
                    Количество уровней
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="levels"
                      type="number"
                      min={1}
                      max={10}
                      value={levels}
                      onChange={(e) => setLevels(Number(e.target.value))}
                      className="w-24 font-mono"
                    />
                    <span className="text-muted-foreground text-sm">
                      {levels === 1 ? 'этаж' : levels <= 4 ? 'этажа' : 'этажей'}
                    </span>
                  </div>
                </div>

                {/* Вертикальная опора (disabled если 1 этаж) */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label htmlFor="vertical" className="justify-self-start">
                    Вертик. опора
                  </Label>
                  <Select
                    value={verticalStandType}
                    onValueChange={(v) => setVerticalStandType(v ?? '')}
                    disabled={levels === 1}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={levels === 1 ? 'Не требуется (1 этаж)' : 'Выберите...'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.verticalStands.map((stand) => (
                        <SelectItem key={stand.value} value={stand.value}>
                          {stand.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Опора */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label htmlFor="support" className="justify-self-start">
                    Опора
                  </Label>
                  <Select value={supportType} onValueChange={(v) => setSupportType(v ?? '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите..." />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.supports.map((support) => (
                        <SelectItem key={support.value} value={support.value}>
                          {support.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Количество рядов */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label htmlFor="rows" className="justify-self-start">
                    Количество рядов
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rows"
                      type="number"
                      min={1}
                      max={4}
                      value={rows}
                      onChange={(e) => setRows(Number(e.target.value))}
                      className="w-24 font-mono"
                    />
                    <span className="text-muted-foreground text-sm">
                      {rows === 1 ? 'ряд' : rows <= 4 ? 'ряда' : 'рядов'}
                    </span>
                  </div>
                </div>

                {/* Балок в ряду */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label htmlFor="beams" className="justify-self-start">
                    Балок в ряду
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="beams"
                      type="number"
                      min={2}
                      max={4}
                      value={beamsPerRow}
                      onChange={(e) => setBeamsPerRow(Number(e.target.value))}
                      className="w-24 font-mono"
                    />
                    <span className="text-muted-foreground text-sm">
                      {beamsPerRow === 2 ? 'балки' : 'балок'}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Секция: Пролёты */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addSpan}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-muted-foreground text-sm">Добавить пролёт</span>
                </div>

                {/* Список пролётов */}
                {spans.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    Нет добавленных пролётов
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
                          onValueChange={(v) => updateSpan(index, 'type', v ?? '')}
                        >
                          <SelectTrigger className="h-8 min-w-[120px]">
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
                          onChange={(e) => updateSpan(index, 'quantity', Number(e.target.value))}
                          className="h-8 w-[72px] text-center font-mono"
                        />

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSpan(index)}
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
                onClick={handleCalculate}
                disabled={calculateMutation.isPending || !options || spans.length === 0}
              >
                <Calculator className="mr-2 h-4 w-4" />
                {calculateMutation.isPending ? 'Расчёт...' : 'Рассчитать'}
              </Button>
            </CardContent>
          </Card>

          {/* Результаты */}
          <Card>
            <CardHeader>
              <CardTitle>Результаты расчёта</CardTitle>
              <CardDescription>
                {result
                  ? 'Конфигурация и стоимость стеллажа'
                  : 'Выполните расчёт для просмотра результатов'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!result ? (
                <div className="text-muted-foreground flex h-48 items-center justify-center">
                  <Calculator className="h-12 w-12 opacity-50" />
                </div>
              ) : (
                <>
                  {/* Название */}
                  <div>
                    <h3 className="text-lg font-semibold">{result.name}</h3>
                    <p className="text-muted-foreground text-sm">{result.description}</p>
                  </div>

                  <Separator />

                  {/* Компоненты */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Компоненты:</h4>

                    {/* Опоры */}
                    {result.components.supports.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm">
                          {result.components.supports.map((s, i) => (
                            <div key={i} className="flex justify-between">
                              <span>Опоры {s.type === 'edge' ? 'крайние' : 'промежуточные'}</span>
                              <Badge variant="secondary">{s.quantity} шт</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Балки */}
                    {result.components.beams.length > 0 && (
                      <div className="space-y-1">
                        {result.components.beams.map((b, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>Балки {b.type} мм</span>
                            <Badge variant="secondary">{b.quantity} шт</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Вертикальные стойки */}
                    {result.components.verticalStands && (
                      <div className="flex justify-between text-sm">
                        <span>Вертикальные стойки {result.components.verticalStands.type}</span>
                        <Badge variant="secondary">
                          {result.components.verticalStands.quantity} шт
                        </Badge>
                      </div>
                    )}

                    {/* Раскосы */}
                    {result.components.braces && (
                      <div className="flex justify-between text-sm">
                        <span>Раскосы</span>
                        <Badge variant="secondary">{result.components.braces.quantity} шт</Badge>
                      </div>
                    )}

                    {/* Изоляторы */}
                    {result.components.isolators && (
                      <div className="flex justify-between text-sm">
                        <span>Изоляторы</span>
                        <Badge variant="secondary">{result.components.isolators.quantity} шт</Badge>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Цены */}
                  {result.pricing && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Стоимость:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Базовая цена:</span>
                          <span className="font-medium">
                            {result.pricing.base.toLocaleString()} ₴
                          </span>
                        </div>
                        <div className="text-muted-foreground flex justify-between">
                          <span>Без изоляторов:</span>
                          <span>{result.pricing.withoutIsolators.toLocaleString()} ₴</span>
                        </div>
                        <div className="flex justify-between font-semibold text-green-600">
                          <span>Нулевая цена:</span>
                          <span>{result.pricing.zero.toLocaleString()} ₴</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <Button className="w-full" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить расчёт
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
