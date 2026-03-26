import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { PriceDisplay } from './PriceDisplay'
import type { RackResult } from '@/types/rack'

interface ComponentsTableCardProps {
  result: RackResult
  onAddToSet?: (result: RackResult) => void
}

/**
 * Таблиця комплектуючих з цінами та сумами
 */
export function ComponentsTableCard({ result, onAddToSet }: ComponentsTableCardProps) {
  // Групуємо балки за типом (об'єднуємо однакові прольоти)
  const groupedBeams = result.components.beams.reduce(
    (acc, beam) => {
      const existing = acc.find((b) => b.type === beam.type)
      if (existing) {
        existing.quantity += beam.quantity
        existing.price = beam.price
        existing.total += beam.total
      } else {
        acc.push({ ...beam })
      }
      return acc
    },
    [] as Array<{ type: string; quantity: number; price: number; total: number }>
  )

  // Формуємо масив всіх компонентів для таблиці
  const components = [
    // Опори
    ...result.components.supports.map((support) => ({
      name: `Опора ${result.configuration.supportType} (${support.type === 'edge' ? 'крайня' : 'пром'})`,
      quantity: support.quantity,
      price: support.price || 0,
      total: support.total || 0,
    })),
    // Балки (об'єднані за типом)
    ...groupedBeams.map((beam) => ({
      name: `Балка ${beam.type} мм`,
      quantity: beam.quantity,
      price: beam.price,
      total: beam.total,
    })),
    // Вертикальні стійки
    ...(result.components.verticalStands
      ? [
          {
            name: `Верт. стійка ${result.components.verticalStands.type}`,
            quantity: result.components.verticalStands.quantity,
            price: result.components.verticalStands.price || 0,
            total: result.components.verticalStands.total || 0,
          },
        ]
      : []),
    // Розкоси
    ...(result.components.braces
      ? [
          {
            name: 'Розкоси',
            quantity: result.components.braces.quantity,
            price: result.components.braces.price || 0,
            total: result.components.braces.total || 0,
          },
        ]
      : []),
    // Ізолятори
    ...(result.components.isolators
      ? [
          {
            name: 'Ізолятори',
            quantity: result.components.isolators.quantity,
            price: result.components.isolators.price || 0,
            total: result.components.isolators.total || 0,
          },
        ]
      : []),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Комплектуючі</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Таблиця компонентів */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-11">Компонент</TableHead>
                <TableHead className="h-11 text-right">Кількість</TableHead>
                <TableHead className="h-11 text-right">Ціна за од., ₴</TableHead>
                <TableHead className="h-11 text-right">Загальна вартість, ₴</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component, index) => (
                <TableRow key={index} className="hover:bg-muted/30 h-12 transition-colors">
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell className="text-right font-mono">
                    <Badge variant="secondary">{component.quantity} шт</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceDisplay value={component.price} size="sm" />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <PriceDisplay value={component.total} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Блок цін */}
        <div className="space-y-2 border-t pt-4">
          {/* Базова ціна - виділена */}
          <div className="bg-muted/50 rounded-md p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Базова ціна:</span>
              <PriceDisplay value={result.pricing.base} size="lg" />
            </div>
          </div>

          {/* Нульова ціна */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Нульова:</span>
            <PriceDisplay value={result.pricing.zero} size="lg" variant="success" />
          </div>

          {/* Без ізоляторів */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Без ізоляторів:</span>
            <PriceDisplay value={result.pricing.withoutIsolators} size="lg" />
          </div>
        </div>

        {/* Кнопка "Додати до комплекту" */}
        {onAddToSet && (
          <Button className="w-full" variant="outline" onClick={() => onAddToSet(result)}>
            <Plus className="mr-2 h-4 w-4" />
            Додати до комплекту
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
