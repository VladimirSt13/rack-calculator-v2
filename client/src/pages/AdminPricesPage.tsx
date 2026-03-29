import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Power, Package, ChevronRight, Save, Download, Upload } from 'lucide-react'
import { priceAdminService } from '@/services/price-admin.service'
import { PriceItemsTable } from '@/components/admin/PriceItemsTable'
import { EditItemModal } from '@/components/admin/EditItemModal'
import type { Price, PriceSummary, PriceItem } from '@/types/price-admin'

const AdminPricesPage: React.FC = () => {
  const navigate = useNavigate()
  const { priceId } = useParams<{ priceId: string }>()

  const [prices, setPrices] = useState<PriceSummary[]>([])
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editItemModalOpen, setEditItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null)

  // New price form
  const [newPriceName, setNewPriceName] = useState('')
  const [newPriceDescription, setNewPriceDescription] = useState('')
  const [newPriceCategory, setNewPriceCategory] = useState('rack')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadPrices()
  }, [])

  useEffect(() => {
    if (priceId && !selectedPrice) {
      loadPriceById(priceId)
    }
  }, [priceId])

  const loadPrices = async () => {
    try {
      setIsLoading(true)
      const data = await priceAdminService.getAllPrices()
      setPrices(data)
    } catch (error) {
      toast.error('Не вдалося завантажити прайси: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPriceById = async (id: string) => {
    try {
      const price = await priceAdminService.getPriceById(id)
      // Сортуємо елементи при завантаженні
      price.items = sortItems(price.items)
      setSelectedPrice(price)
    } catch (error) {
      toast.error('Не вдалося завантажити прайс: ' + (error as Error).message)
    }
  }

  const handleSelectPrice = (id: string) => {
    navigate(`/admin/prices/${id}`)
  }

  const handleBackToList = () => {
    setSelectedPrice(null)
    navigate('/admin/prices')
  }

  const handleActivate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await priceAdminService.activatePrice(id)
      toast.success('Прайс активовано')
      loadPrices()
      if (selectedPrice?.id === id) {
        loadPriceById(id)
      }
    } catch (error) {
      toast.error('Не вдалося активувати прайс: ' + (error as Error).message)
    }
  }

  const handleDeactivate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await priceAdminService.deactivatePrice(id)
      toast.success('Прайс деактивовано')
      loadPrices()
      if (selectedPrice?.id === id) {
        loadPriceById(id)
      }
    } catch (error) {
      toast.error('Не вдалося деактивувати прайс: ' + (error as Error).message)
    }
  }

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Ви впевнені, що хочете видалити прайс "${name}"?`)) {
      return
    }

    try {
      await priceAdminService.deletePrice(id)
      toast.success('Прайс видалено')
      if (selectedPrice?.id === id) {
        handleBackToList()
      } else {
        loadPrices()
      }
    } catch (error) {
      toast.error('Не вдалося видалити прайс: ' + (error as Error).message)
    }
  }

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedPrice) return

    try {
      const response = await fetch(`/api/prices/${selectedPrice.id}/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `price_${selectedPrice.name || selectedPrice.id}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Прайс експортовано')
    } catch (error) {
      toast.error('Не вдалося експортувати прайс: ' + (error as Error).message)
    }
  }

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedPrice) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/prices/${selectedPrice.id}/import`, {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      if (result.success) {
        toast.success(`Імпортовано: ${result.data.imported} нових, ${result.data.updated} оновлено`)
        await loadPriceById(selectedPrice.id)
        setHasUnsavedChanges(true)
      } else {
        toast.error('Не вдалося імпортувати: ' + result.error)
      }
    } catch (error) {
      toast.error('Не вдалося імпортувати: ' + (error as Error).message)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCreate = async () => {
    if (!newPriceName.trim()) {
      toast.error('Введіть назву прайсу')
      return
    }

    try {
      setIsCreating(true)
      await priceAdminService.createPrice({
        name: newPriceName,
        description: newPriceDescription || undefined,
        category: newPriceCategory,
        items: [],
      })
      toast.success('Прайс створено')
      setNewPriceName('')
      setNewPriceDescription('')
      setNewPriceCategory('rack')
      setCreateDialogOpen(false)
      loadPrices()
    } catch (error) {
      toast.error('Не вдалося створити прайс: ' + (error as Error).message)
    } finally {
      setIsCreating(false)
    }
  }

  // Item operations
  const handleAddItem = () => {
    setEditingItem(null)
    setEditItemModalOpen(true)
  }

  const handleEditItem = (item: PriceItem) => {
    setEditingItem(item)
    setEditItemModalOpen(true)
  }

  const handleDeleteItem = async (item: PriceItem) => {
    if (!selectedPrice) return

    if (!confirm(`Видалити елемент "${item.id}"?`)) {
      return
    }

    try {
      await priceAdminService.deleteItem(selectedPrice.id, item.id)
      toast.success('Елемент видалено')
      await loadPriceById(selectedPrice.id)
      setHasUnsavedChanges(true)
    } catch (error) {
      toast.error('Не вдалося видалити елемент: ' + (error as Error).message)
    }
  }

  const handleSaveItem = async (item: PriceItem) => {
    if (!selectedPrice) return

    try {
      let updatedItems: PriceItem[]

      if (editingItem) {
        // Edit existing - замінюємо елемент
        updatedItems = selectedPrice.items.map((i) => (i.id === item.id ? item : i))
        await priceAdminService.updateItem(selectedPrice.id, item.id, item)
        toast.success('Елемент оновлено')
      } else {
        // Add new - додаємо і сортуємо
        updatedItems = [...selectedPrice.items, item]
        updatedItems = sortItems(updatedItems)
        await priceAdminService.addItem(selectedPrice.id, item)
        toast.success('Елемент додано')
      }

      // Оновлюємо локальний стан з відсортованими елементами
      setSelectedPrice({ ...selectedPrice, items: updatedItems })
      setHasUnsavedChanges(true)
    } catch (error) {
      toast.error('Не вдалося зберегти елемент: ' + (error as Error).message)
    }
  }

  const sortItems = (items: PriceItem[]): PriceItem[] => {
    const typeOrder: Record<string, number> = {
      support: 1,
      span: 2,
      vertical_support: 3,
      diagonal_brace: 4,
      isolator: 5,
    }

    return [...items].sort((a, b) => {
      // Спочатку сортуємо за типом
      const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99)
      if (typeDiff !== 0) return typeDiff

      // Потім за розміром (числовим або рядком)
      const aNum = parseFloat(a.size || '0')
      const bNum = parseFloat(b.size || '0')

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum
      }

      // Якщо не числа, сортуємо як рядки
      return (a.size || '').localeCompare(b.size || '')
    })
  }

  const handleSavePrice = async () => {
    if (!selectedPrice) return

    try {
      await priceAdminService.updatePrice(selectedPrice.id, {
        name: selectedPrice.name,
        description: selectedPrice.description,
        items: selectedPrice.items,
      })
      toast.success('Прайс збережено')
      setHasUnsavedChanges(false)
      loadPrices()
    } catch (error) {
      toast.error('Не вдалося зберегти прайс: ' + (error as Error).message)
    }
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      rack: 'Стелажі',
      battery: 'АКБ',
      rack_components: 'Комплектуючі',
    }
    return names[category] || category
  }

  const getPriceDisplayName = (price: Price | PriceSummary) => {
    return price.name || getCategoryName(price.category) || price.category
  }

  // Detail view with editor
  if (selectedPrice) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackToList}>
                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                Назад
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{getPriceDisplayName(selectedPrice)}</h1>
                <div className="mt-1 flex items-center gap-2">
                  {selectedPrice.isActive && <Badge variant="default">Активний</Badge>}
                  {!selectedPrice.isActive && <Badge variant="secondary">Неактивний</Badge>}
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-yellow-600">
                      Є незбережені зміни
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Button onClick={handleSavePrice}>
                  <Save className="mr-2 h-4 w-4" />
                  Зберегти зміни
                </Button>
              )}
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Експорт Excel
              </Button>
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Імпорт Excel
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={handleImportFile}
              />
              {selectedPrice.isActive ? (
                <Button variant="outline" onClick={(e) => handleDeactivate(selectedPrice.id, e)}>
                  <Power className="mr-2 h-4 w-4 text-green-600" />
                  Деактивувати
                </Button>
              ) : (
                <Button variant="outline" onClick={(e) => handleActivate(selectedPrice.id, e)}>
                  <Power className="mr-2 h-4 w-4 text-gray-400" />
                  Активувати
                </Button>
              )}
            </div>
          </div>

          {selectedPrice.description && (
            <p className="text-muted-foreground mb-6">{selectedPrice.description}</p>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Елементи прайсу</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceItemsTable
                items={selectedPrice.items}
                onAdd={handleAddItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            </CardContent>
          </Card>

          {/* Edit Item Modal */}
          <EditItemModal
            open={editItemModalOpen}
            onOpenChange={setEditItemModalOpen}
            item={editingItem}
            onSave={handleSaveItem}
          />
        </div>
      </AppLayout>
    )
  }

  // List view
  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Управління прайсами</h1>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Створити прайс
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список прайсів</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground py-8 text-center">Завантаження...</div>
            ) : prices.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 opacity-30" />
                <p>Немає створених прайсів</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {prices.map((price) => (
                    <div
                      key={price.id}
                      className="hover:bg-muted/50 cursor-pointer rounded-lg border p-4 transition-colors"
                      onClick={() => handleSelectPrice(price.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getPriceDisplayName(price)}</span>
                            {price.isActive && (
                              <Badge variant="default" className="h-5 text-xs">
                                Активний
                              </Badge>
                            )}
                            {!price.isActive && (
                              <Badge variant="secondary" className="h-5 text-xs">
                                Неактивний
                              </Badge>
                            )}
                          </div>
                          <div className="text-muted-foreground mt-1 text-sm">
                            {getCategoryName(price.category)} • {price.itemsCount} елементів
                          </div>
                          <div className="text-muted-foreground mt-1 text-xs">
                            Оновлено: {new Date(price.updatedAt).toLocaleDateString('uk-UA')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleDelete(price.id, getPriceDisplayName(price), e)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                          {price.isActive ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleDeactivate(price.id, e)}
                            >
                              <Power className="h-4 w-4 text-green-600" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleActivate(price.id, e)}
                            >
                              <Power className="h-4 w-4 text-gray-400" />
                            </Button>
                          )}
                          <ChevronRight className="text-muted-foreground h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Створити новий прайс</DialogTitle>
              <DialogDescription>Введіть назву та опис для нового прайсу</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Назва прайсу *</Label>
                <Input
                  id="name"
                  value={newPriceName}
                  onChange={(e) => setNewPriceName(e.target.value)}
                  placeholder="Напр. Прайс 2024-Q1"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Категорія</Label>
                <select
                  id="category"
                  value={newPriceCategory}
                  onChange={(e) => setNewPriceCategory(e.target.value)}
                  className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="rack">Стелажі</option>
                  <option value="battery">АКБ</option>
                  <option value="rack_components">Комплектуючі</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={newPriceDescription}
                  onChange={(e) => setNewPriceDescription(e.target.value)}
                  placeholder="Короткий опис..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Скасувати
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !newPriceName.trim()}>
                {isCreating ? 'Створення...' : 'Створити'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

export default AdminPricesPage
