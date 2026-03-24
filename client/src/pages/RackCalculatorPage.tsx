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
import { Plus, Trash2, Save, Calculator } from 'lucide-react'
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
    if (options) {
      // Установить значения по умолчанию из прайса
      if (!supportType && options.supports.length > 0) {
        setSupportType(options.supports[0].value)
      }
      if (!verticalStandType && options.verticalStands.length > 0) {
        setVerticalStandType(options.verticalStands[0].value)
      }
      if (spans.length === 0 && options.spans.length > 0) {
        setSpans([{ type: options.spans[0].value, quantity: 2 }])
      }
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
    }
  }

  // Обновление пролёта
  const updateSpan = (index: number, field: keyof SpanInput, value: string | number) => {
    const newSpans = [...spans]
    newSpans[index] = { ...newSpans[index], [field]: value }
    setSpans(newSpans)
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Калькулятор стеллажей</h1>
          <p className="text-muted-foreground">
            Расчёт конфигурации и стоимости стеллажного оборудования
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Форма */}
          <Card>
            <CardHeader>
              <CardTitle>Параметры стеллажа</CardTitle>
              <CardDescription>Введите конфигурацию стеллажа для расчёта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Поверховість */}
              <div className="space-y-2">
                <Label htmlFor="levels">Количество уровней (ярусов)</Label>
                <Select value={String(levels)} onValueChange={(v) => setLevels(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 уровень (одноповерховий)</SelectItem>
                    <SelectItem value="2">2 уровня (двоповерховий)</SelectItem>
                    <SelectItem value="3">3 уровня (трьохповерховий)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Рядність */}
              <div className="space-y-2">
                <Label htmlFor="rows">Количество рядов</Label>
                <Select value={String(rows)} onValueChange={(v) => setRows(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'ряд' : n <= 4 ? 'ряда' : 'рядов'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Балок на ряд */}
              <div className="space-y-2">
                <Label htmlFor="beams">Балок на ряд</Label>
                <Input
                  id="beams"
                  type="number"
                  min={1}
                  value={beamsPerRow}
                  onChange={(e) => setBeamsPerRow(Number(e.target.value))}
                />
              </div>

              {/* Тип опоры - из прайса */}
              <div className="space-y-2">
                <Label htmlFor="support">Тип опоры</Label>
                <Select value={supportType} onValueChange={(v) => setSupportType(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип опоры" />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.supports.map((support) => (
                      <SelectItem key={support.value} value={support.value}>
                        {support.value} {support.stepped ? '(ступенчатая)' : '(прямая)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Тип верт. стоек - из прайса (для 2+ этажей) */}
              {levels >= 2 && (
                <div className="space-y-2">
                  <Label htmlFor="vertical">Тип вертикальных стоек</Label>
                  <Select
                    value={verticalStandType}
                    onValueChange={(v) => setVerticalStandType(v ?? '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
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
              )}

              {/* Пролёты - из прайса */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Пролёты</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addSpan}>
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-2">
                  {spans.map((span, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={span.type}
                        onValueChange={(v) => updateSpan(index, 'type', v ?? '')}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options?.spans.map((spanType) => (
                            <SelectItem key={spanType.value} value={spanType.value}>
                              {spanType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        min={1}
                        value={span.quantity}
                        onChange={(e) => updateSpan(index, 'quantity', Number(e.target.value))}
                        className="w-20"
                        placeholder="Кол-во"
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeSpan(index)}
                        disabled={spans.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <Button
                className="w-full"
                onClick={handleCalculate}
                disabled={calculateMutation.isPending || !options}
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
