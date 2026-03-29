import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, ChevronRight } from 'lucide-react'
import type { PriceItem } from '@/types/price-admin'

interface PriceItemsTableProps {
  items: PriceItem[]
  onAdd: () => void
  onEdit: (item: PriceItem) => void
  onDelete: (item: PriceItem) => void
}

export const PriceItemsTable: React.FC<PriceItemsTableProps> = ({
  items,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      support: 'Опора',
      span: 'Балка',
      vertical_support: 'Вертикальна стійка',
      diagonal_brace: 'Розкос',
      isolator: 'Ізолятор',
    }
    return labels[type] || type
  }

  const getVariantCount = (item: PriceItem) => {
    if (!item.variants) return 0
    return item.variants.length
  }

  const getPriceDisplay = (item: PriceItem) => {
    if (item.variants && item.variants.length > 0) {
      const prices = item.variants.map((v) => v.price)
      return `${Math.min(...prices)} - ${Math.max(...prices)} ₴`
    }
    return item.price ? `${item.price} ₴` : '-'
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">У прайсі немає елементів</p>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Додати перший елемент
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Всього елементів: <span className="font-medium">{items.length}</span>
        </p>
        <Button size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Додати елемент
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Тип</TableHead>
              <TableHead className="w-[100px]">Розмір</TableHead>
              <TableHead>Варіанти</TableHead>
              <TableHead className="w-[150px] text-right">Ціна</TableHead>
              <TableHead className="w-[100px] text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{getTypeLabel(item.type)}</TableCell>
                <TableCell className="font-mono">{item.size || '-'}</TableCell>
                <TableCell>
                  {item.variants && item.variants.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.variants.map((variant) => (
                        <Badge key={variant.id} variant="outline" className="text-xs">
                          {variant.variant === 'edge' ? 'Крайня' : 'Проміжна'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {getPriceDisplay(item)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
