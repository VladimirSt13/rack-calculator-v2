import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Package, Plus, Minus, Trash2, Save } from 'lucide-react'
import { useRackSetStore } from '@/stores/rackSet.store'
import { PriceDisplay } from '@/components/rack/PriceDisplay'
import { ClearButton } from '@/components/ui/ClearButton'

interface RackSetCardProps {
  onSave?: () => void
}

/**
 * Картка комплекту стелажів
 */
export function RackSetCard({ onSave }: RackSetCardProps) {
  const {
    items,
    totalZero,
    totalWithoutIsolators,
    incrementQuantity,
    decrementQuantity,
    removeRack,
    clearSet,
  } = useRackSetStore()

  const hasItems = items.length > 0

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            Комплект стелажів
          </CardTitle>
          <ClearButton onClick={clearSet} disabled={!hasItems} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Список стелажів */}
        {hasItems ? (
          <ScrollArea>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.rackId}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 rounded-md border p-3"
                >
                  {/* Назва + ціна за од. (дрібним текстом) */}
                  <div className="space-y-1">
                    <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                  </div>

                  {/* Кількість [−][input][+] */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => decrementQuantity(item.rackId)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="h-8 w-12 text-center font-mono"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => incrementQuantity(item.rackId)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Ціна за од. (w-24) */}
                  <div className="w-24 text-right">
                    <PriceDisplay value={item.result.pricing.zero} size="sm" variant="success" />
                  </div>

                  {/* Сума (w-28, green) */}
                  <div className="w-28 text-right font-medium text-green-600">
                    <PriceDisplay
                      value={item.result.pricing.zero * item.quantity}
                      size="sm"
                      variant="success"
                    />
                  </div>

                  {/* Видалити (кнопка) */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive h-8 w-8"
                    onClick={() => removeRack(item.rackId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>Комплект порожній</p>
            <p className="text-xs">Додайте стелажі з калькулятора</p>
          </div>
        )}

        <Separator />

        {/* Підсумок */}
        {hasItems && (
          <div className="space-y-3">
            {/* Нульова вартість: великий, зелений */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Нульова вартість:</span>
              <PriceDisplay value={totalZero} size="xl" variant="success" />
            </div>
            {/* Вартість без ізоляторів */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Вартість без ізоляторів:</span>
              <PriceDisplay value={totalWithoutIsolators} size="lg" />
            </div>
          </div>
        )}

        {/* Кнопка "Зберегти" - внизу, широка */}
        <Button className="w-full" onClick={onSave} disabled={!hasItems}>
          <Save className="mr-2 h-4 w-4" />
          Зберегти комплект
        </Button>
      </CardContent>
    </Card>
  )
}
