import { useState, useImperativeHandle, forwardRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Package, Save, X, ChevronRight } from 'lucide-react'
import { useRackSetStore } from '@/stores/rackSet.store'
import { PriceDisplay } from '@/components/rack/PriceDisplay'
import { toast } from 'sonner'
import { saveSetSchema } from '@/utils/validation/rackSet.validation'

export interface SaveSetModalRef {
  open: () => void
  close: () => void
}

/**
 * Модальне вікно збереження комплекту стелажів
 */
export const SaveSetModal = forwardRef<SaveSetModalRef>(function SaveSetModal(_, ref) {
  const [open, setOpen] = useState(false)
  const [objectName, setObjectName] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<{ objectName?: string; note?: string }>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const { items, totalZero, totalWithoutIsolators, clearSet } = useRackSetStore()

  // Дозволяємо відкривати модальне вікно ззовні через ref
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => {
      setOpen(false)
      setObjectName('')
      setNote('')
      setErrors({})
      setExpandedItems({})
    },
  }))

  const handleClose = () => {
    setOpen(false)
    setObjectName('')
    setNote('')
    setErrors({})
    setExpandedItems({})
  }

  const handleSave = () => {
    // Валідація
    const result = saveSetSchema.safeParse({ objectName, note })

    if (!result.success) {
      const fieldErrors: { objectName?: string; note?: string } = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        if (field === 'objectName') {
          fieldErrors.objectName = issue.message
        } else if (field === 'note') {
          fieldErrors.note = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    // Імітація збереження (тут буде API call)
    toast.success(`Комплект "${objectName}" збережено успішно!`)

    // Очищення
    clearSet()
    handleClose()
  }

  const toggleExpand = (rackId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [rackId]: !prev[rackId],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden p-0">
        {/* Header - фіксований */}
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Зберегти комплект стелажів
          </DialogTitle>
          <DialogDescription>
            Введіть назву об'єкту та перегляньте склад комплекту
          </DialogDescription>
        </DialogHeader>

        {/* Content - скрол */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Поля форми */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="objectName" className="text-sm font-medium">
                  Назва об'єкту <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="objectName"
                  placeholder="напр. Склад Київ, вул. Столична"
                  value={objectName}
                  onChange={(e) => setObjectName(e.target.value)}
                  className={errors.objectName ? 'border-destructive' : ''}
                />
                {errors.objectName && (
                  <p className="text-destructive text-xs">{errors.objectName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">
                  Примітка
                </Label>
                <Textarea
                  id="note"
                  placeholder="напр. Для менеджера Олександра"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[60px]"
                />
                {errors.note && <p className="text-destructive text-xs">{errors.note}</p>}
              </div>
            </div>

            <Separator />

            {/* Склад комплекту */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="text-muted-foreground h-4 w-4" />
                <h4 className="text-sm font-medium">Склад комплекту</h4>
                <Badge variant="secondary">{items.length} шт</Badge>
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={item.rackId} className="bg-muted/30 overflow-hidden rounded-lg border">
                    {/* Заголовок стелажа */}
                    <button
                      onClick={() => toggleExpand(item.rackId)}
                      className="hover:bg-muted/50 flex w-full items-center justify-between p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                          <span className="text-primary text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="text-left">
                          <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                          <div className="text-muted-foreground flex items-center gap-3 text-xs">
                            <span>{item.quantity} шт</span>
                            <PriceDisplay
                              value={item.result.pricing.zero * item.quantity}
                              size="xs"
                              variant="success"
                            />
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`text-muted-foreground h-4 w-4 transition-transform ${
                          expandedItems[item.rackId] ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {/* Деталі стелажа (розгортається) */}
                    {expandedItems[item.rackId] && (
                      <div className="bg-muted/20 border-t p-3">
                        <div className="space-y-3 text-xs">
                          <p className="text-sm font-medium">Компоненти стелажа:</p>

                          {/* Опори - детально */}
                          {item.result.components.supports.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-muted-foreground font-medium">Опори:</p>
                              {item.result.components.supports.map((support, idx) => (
                                <div key={idx} className="flex justify-between pl-3">
                                  <span>
                                    {support.type === 'edge' ? 'Крайня' : 'Проміжна'} (
                                    {item.configuration.supportType})
                                  </span>
                                  <span className="font-medium">
                                    {support.quantity} шт ×{' '}
                                    <PriceDisplay value={support.price || 0} size="xs" /> ={' '}
                                    <PriceDisplay
                                      value={support.total || 0}
                                      size="xs"
                                      variant="success"
                                    />
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Балки - детально */}
                          {item.result.components.beams.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-muted-foreground font-medium">Балки:</p>
                              {item.result.components.beams.map((beam, idx) => (
                                <div key={idx} className="flex justify-between pl-3">
                                  <span>Балка {beam.type} мм</span>
                                  <span className="font-medium">
                                    {beam.quantity} шт ×{' '}
                                    <PriceDisplay value={beam.price || 0} size="xs" /> ={' '}
                                    <PriceDisplay
                                      value={beam.total || 0}
                                      size="xs"
                                      variant="success"
                                    />
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Вертикальні стійки */}
                          {item.result.components.verticalStands && (
                            <div className="flex justify-between pl-3">
                              <span className="text-muted-foreground">
                                Верт. стійки ({item.result.components.verticalStands.type}):
                              </span>
                              <span className="font-medium">
                                {item.result.components.verticalStands.quantity} шт ×{' '}
                                <PriceDisplay
                                  value={item.result.components.verticalStands.price || 0}
                                  size="xs"
                                />{' '}
                                ={' '}
                                <PriceDisplay
                                  value={item.result.components.verticalStands.total || 0}
                                  size="xs"
                                  variant="success"
                                />
                              </span>
                            </div>
                          )}

                          {/* Розкоси */}
                          {item.result.components.braces && (
                            <div className="flex justify-between pl-3">
                              <span className="text-muted-foreground">Розкоси:</span>
                              <span className="font-medium">
                                {item.result.components.braces.quantity} шт ×{' '}
                                <PriceDisplay
                                  value={item.result.components.braces.price || 0}
                                  size="xs"
                                />{' '}
                                ={' '}
                                <PriceDisplay
                                  value={item.result.components.braces.total || 0}
                                  size="xs"
                                  variant="success"
                                />
                              </span>
                            </div>
                          )}

                          {/* Ізолятори */}
                          {item.result.components.isolators && (
                            <div className="flex justify-between pl-3">
                              <span className="text-muted-foreground">Ізолятори:</span>
                              <span className="font-medium">
                                {item.result.components.isolators.quantity} шт ×{' '}
                                <PriceDisplay
                                  value={item.result.components.isolators.price || 0}
                                  size="xs"
                                />{' '}
                                ={' '}
                                <PriceDisplay
                                  value={item.result.components.isolators.total || 0}
                                  size="xs"
                                  variant="success"
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Підсумкова вартість */}
            <div className="bg-muted/30 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-medium">Підсумкова вартість:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Нульова вартість:</span>
                  <PriceDisplay value={totalZero} size="xl" variant="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Вартість без ізоляторів:</span>
                  <PriceDisplay value={totalWithoutIsolators} size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - фіксований */}
        <div className="flex-shrink-0 border-t px-6 py-4">
          {/* Кнопка "Зберегти" - широка, внизу */}
          <Button onClick={handleSave} className="w-full gap-2" size="lg">
            <Save className="h-4 w-4" />
            Зберегти комплект
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
