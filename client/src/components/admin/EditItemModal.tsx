import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { PriceItem, PriceVariant } from '@/types/price-admin'

interface EditItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: PriceItem | null
  onSave: (item: PriceItem) => void
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
}) => {
  const [type, setType] = useState('support')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')
  const [variants, setVariants] = useState<Array<{ id: string; variant: string; price: string; weight: string }>>([])

  const isEditMode = !!item

  useEffect(() => {
    if (item) {
      setType(item.type)
      setSize(item.size || '')
      setPrice(item.price?.toString() || '')
      setWeight(item.weight?.toString() || '')
      setVariants(
        item.variants?.map((v) => ({
          id: v.id,
          variant: v.variant,
          price: v.price.toString(),
          weight: v.weight?.toString() || '',
        })) || []
      )
    } else {
      resetForm()
    }
  }, [item, open])

  const resetForm = () => {
    setType('support')
    setSize('')
    setPrice('')
    setWeight('')
    setVariants([])
  }

  const handleAddVariant = () => {
    const variantType = variants.length === 0 ? 'edge' : 'intermediate'
    setVariants([
      ...variants,
      { id: `variant_${Date.now()}`, variant: variantType, price: '', weight: '' },
    ])
  }

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleVariantChange = (
    index: number,
    field: 'variant' | 'price' | 'weight',
    value: string
  ) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleSave = () => {
    if (!size.trim()) {
      toast.error('Введіть розмір')
      return
    }

    const newItem: PriceItem = {
      id: item?.id || `item_${Date.now()}`,
      type,
      size,
      price: price ? parseFloat(price) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      variants:
        variants.length > 0
          ? variants.map((v) => ({
              id: v.id,
              variant: v.variant,
              price: parseFloat(v.price) || 0,
              weight: v.weight ? parseFloat(v.weight) : undefined,
            }))
          : undefined,
    }

    onSave(newItem)
    handleClose()
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const hasVariants = type === 'support'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Редагувати елемент' : 'Додати елемент'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Змініть параметри елемента прайсу'
              : 'Заповніть інформацію про новий елемент прайсу'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Тип *</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={isEditMode}
              >
                <option value="support">Опора (support)</option>
                <option value="span">Балка (span)</option>
                <option value="vertical_support">Вертикальна стійка</option>
                <option value="diagonal_brace">Розкос</option>
                <option value="isolator">Ізолятор</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="size">Розмір *</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Напр. 215, 600"
              />
            </div>
          </div>

          {!hasVariants && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Ціна, ₴</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  step="0.01"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weight">Вага, кг</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {hasVariants && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label>Варіанти (крайня/проміжна)</Label>
                  {variants.length < 2 && (
                    <Button type="button" size="sm" variant="outline" onClick={handleAddVariant}>
                      <Plus className="h-4 w-4 mr-2" />
                      Додати варіант
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="grid grid-cols-3 gap-2 items-start">
                      <div className="grid gap-2">
                        <Label className="text-xs">Тип</Label>
                        <select
                          value={variant.variant}
                          onChange={(e) =>
                            handleVariantChange(index, 'variant', e.target.value)
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                        >
                          <option value="edge">Крайня</option>
                          <option value="intermediate">Проміжна</option>
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-xs">Ціна, ₴</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, 'price', e.target.value)
                          }
                          placeholder="0"
                          step="0.01"
                          className="h-9"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="grid gap-2 flex-1">
                          <Label className="text-xs">Вага, кг</Label>
                          <Input
                            type="number"
                            value={variant.weight}
                            onChange={(e) =>
                              handleVariantChange(index, 'weight', e.target.value)
                            }
                            placeholder="0"
                            step="0.01"
                            className="h-9"
                          />
                        </div>
                        {variants.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-600"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? 'Зберегти' : 'Додати'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
