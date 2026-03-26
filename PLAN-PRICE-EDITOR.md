# 📋 План імплементації: Admin Price Editor (Sprint 5.5)

> **Пріоритет:** 🔴 Високий  
> **Оцінка:** 1 тиждень  
> **Статус:** ⏳ В роботі  
> **Доступ:** ADMIN only

---

## 🎯 Мета

Створити адмін-панель для управління прайсами з можливістю:

- Перегляду у вигляді Excel-подібної таблиці
- Inline редагування клітинок
- Масового оновлення цін
- Імпорту з Excel/CSV
- Експорту в Excel/CSV

---

## 📦 Частина 1: Backend

### 1.1 Оновлення Prisma Schema

**Файл:** `server/prisma/schema.prisma`

**Завдання:**
- [ ] Перевірити, що модель `Price` має поля для активації/деактивації
- [ ] Додати індекси для швидкої фільтрації

```prisma
model Price {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   // Назва прайсу (напр. "Прайс 2024-Q1")
  description String?
  categories  Json     // { supports: {...}, spans: {...}, ... }
  isActive    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([isActive])
  @@map("prices")
}
```

---

### 1.2 DTO та Валідація

**Файл:** `server/src/modules/price/dtos/bulk-update-price.dto.ts`

```typescript
import { z } from 'zod';

// Схема для однієї ціни
export const priceEntrySchema = z.object({
  code: z.string(),
  price: z.number().positive(),
});

// Схема для категорії
export const priceCategorySchema = z.object({
  code: z.string(),
  price: z.number().positive(),
});

// Схема для оновлення однієї позиції
export const bulkUpdateItemSchema = z.object({
  category: z.string(), // напр. "supports.430.edge"
  code: z.string(),
  price: z.number().positive(),
});

// Схема для масового оновлення
export const bulkUpdatePriceSchema = z.object({
  items: z.array(bulkUpdateItemSchema),
});

export type BulkUpdateItem = z.infer<typeof bulkUpdateItemSchema>;
export type BulkUpdatePriceDto = z.infer<typeof bulkUpdatePriceSchema>;
```

**Файл:** `server/src/modules/price/dtos/import-price.dto.ts`

```typescript
import { z } from 'zod';

export const importPriceItemSchema = z.object({
  category: z.string(),
  code: z.string(),
  name: z.string().optional(),
  price: z.number().positive(),
});

export const importPriceSchema = z.object({
  prices: z.array(importPriceItemSchema),
  name: z.string().min(3),
  description: z.string().optional(),
});

export type ImportPriceItem = z.infer<typeof importPriceItemSchema>;
export type ImportPriceDto = z.infer<typeof importPriceSchema>;
```

---

### 1.3 Use-Cases

#### Use-case 1: BulkUpdatePrices

**Файл:** `server/src/modules/price/application/use-cases/bulk-update-prices.use-case.ts`

```typescript
import { z } from 'zod';
import { PriceRepository } from '../../infrastructure/price.repository';
import { bulkUpdatePriceSchema } from '../../dtos/bulk-update-price.dto';

interface BulkUpdatePricesInput {
  priceId: string;
  items: Array<{
    category: string;
    code: string;
    price: number;
  }>;
}

interface BulkUpdatePricesOutput {
  updated: number;
  skipped: number;
}

export class BulkUpdatePricesUseCase {
  constructor(private priceRepository: PriceRepository) {}

  async execute(input: BulkUpdatePricesInput): Promise<BulkUpdatePricesOutput> {
    // 1. Валідація вхідних даних
    const validatedInput = bulkUpdatePriceSchema.parse(input);

    // 2. Отримати поточний прайс
    const price = await this.priceRepository.findById(input.priceId);
    if (!price) {
      throw new Error('Price not found');
    }

    // 3. Оновити кожну позицію
    let updated = 0;
    let skipped = 0;

    const categories = price.categories as any;

    for (const item of validatedInput.items) {
      const { category, code, price: newPrice } = item;
      
      // Розібрати category path (напр. "supports.430.edge")
      const pathParts = category.split('.');
      
      // Знайти та оновити значення в nested object
      let targetObj = categories;
      for (let i = 0; i < pathParts.length - 1; i++) {
        targetObj = targetObj[pathParts[i]];
      }
      
      const lastKey = pathParts[pathParts.length - 1];
      
      if (targetObj && targetObj[code]) {
        targetObj[code].price = newPrice;
        updated++;
      } else {
        skipped++;
      }
    }

    // 4. Зберегти оновлений прайс
    await this.priceRepository.update(price.id, { categories });

    return { updated, skipped };
  }
}
```

#### Use-case 2: ImportPrices

**Файл:** `server/src/modules/price/application/use-cases/import-prices.use-case.ts`

```typescript
import { PriceRepository } from '../../infrastructure/price.repository';
import { importPriceSchema } from '../../dtos/import-price.dto';

interface ImportPricesInput {
  name: string;
  description?: string;
  prices: Array<{
    category: string;
    code: string;
    name?: string;
    price: number;
  }>;
}

interface ImportPricesOutput {
  priceId: string;
  imported: number;
}

export class ImportPricesUseCase {
  constructor(private priceRepository: PriceRepository) {}

  async execute(input: ImportPricesInput): Promise<ImportPricesOutput> {
    // 1. Валідація
    const validatedInput = importPriceSchema.parse(input);

    // 2. Згрупувати ціни по категоріях
    const categories: Record<string, any> = {};

    for (const item of validatedInput.prices) {
      const { category, code, name, price } = item;
      
      if (!categories[category]) {
        categories[category] = {};
      }
      
      categories[category][code] = {
        code,
        name: name || code,
        price,
      };
    }

    // 3. Створити новий прайс
    const price = await this.priceRepository.create({
      name: validatedInput.name,
      description: validatedInput.description,
      categories,
      isActive: false, // За замовчуванням неактивний
    });

    return {
      priceId: price.id,
      imported: validatedInput.prices.length,
    };
  }
}
```

#### Use-case 3: ExportPrices

**Файл:** `server/src/modules/price/application/use-cases/export-prices.use-case.ts`

```typescript
import { PriceRepository } from '../../infrastructure/price.repository';
import * as XLSX from 'xlsx';

interface ExportPricesInput {
  priceId: string;
  format: 'xlsx' | 'csv';
}

export class ExportPricesUseCase {
  constructor(private priceRepository: PriceRepository) {}

  async execute(input: ExportPricesInput): Promise<Buffer> {
    // 1. Отримати прайс
    const price = await this.priceRepository.findById(input.priceId);
    if (!price) {
      throw new Error('Price not found');
    }

    // 2. Підготувати дані для експорту
    const worksheets: XLSX.WorkSheet[] = [];
    const categories = price.categories as any;

    for (const [categoryName, categoryData] of Object.entries(categories)) {
      const rows: any[] = [];
      
      // Додати заголовок
      rows.push({ Code: '', Name: '', Price: '' });
      
      // Додати рядки
      for (const [code, data] of Object.entries(categoryData as any)) {
        rows.push({
          Code: (data as any).code,
          Name: (data as any).name || code,
          Price: (data as any).price,
        });
      }

      // Створити worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheets.push(worksheet);
    }

    // 3. Створити workbook
    const workbook = {
      SheetNames: Object.keys(categories),
      Sheets: Object.fromEntries(
        Object.keys(categories).map((key, i) => [key, worksheets[i]])
      ),
    };

    // 4. Експортувати в буфер
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: input.format });
    
    return buffer as Buffer;
  }
}
```

---

### 1.4 Infrastructure: Controller

**Файл:** `server/src/modules/price/interfaces/price.controller.ts`

```typescript
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { requireRole } from '../../../common/middleware/require-role';
import { PriceRepository } from '../infrastructure/price.repository';
import { BulkUpdatePricesUseCase } from '../application/use-cases/bulk-update-prices.use-case';
import { ImportPricesUseCase } from '../application/use-cases/import-prices.use-case';
import { ExportPricesUseCase } from '../application/use-cases/export-prices.use-case';

export class PriceController {
  private router: Router;
  private priceRepository: PriceRepository;

  constructor() {
    this.priceRepository = new PriceRepository();
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    // Існуючі routes...
    this.router.get('/', asyncHandler(this.getAll.bind(this)));
    this.router.get('/:id', asyncHandler(this.getById.bind(this)));
    this.router.post('/', requireRole('admin'), asyncHandler(this.create.bind(this)));
    this.router.put('/:id', requireRole('admin'), asyncHandler(this.update.bind(this)));
    this.router.post('/:id/activate', requireRole('admin'), asyncHandler(this.activate.bind(this)));
    this.router.post('/:id/deactivate', requireRole('admin'), asyncHandler(this.deactivate.bind(this)));

    // Нові routes для Admin Price Editor
    this.router.put(
      '/bulk',
      requireRole('admin'),
      asyncHandler(this.bulkUpdate.bind(this)),
    );

    this.router.post(
      '/import',
      requireRole('admin'),
      asyncHandler(this.import.bind(this)),
    );

    this.router.get(
      '/export/:id',
      requireRole('admin'),
      asyncHandler(this.export.bind(this)),
    );
  }

  // Bulk Update: PUT /api/prices/bulk
  private async bulkUpdate(req: Request, res: Response) {
    const { priceId, items } = req.body;
    
    const useCase = new BulkUpdatePricesUseCase(this.priceRepository);
    const result = await useCase.execute({ priceId, items });

    res.json({
      success: true,
      data: result,
    });
  }

  // Import: POST /api/prices/import
  private async import(req: Request, res: Response) {
    const { name, description, prices } = req.body;

    const useCase = new ImportPricesUseCase(this.priceRepository);
    const result = await useCase.execute({ name, description, prices });

    res.status(201).json({
      success: true,
      data: result,
    });
  }

  // Export: GET /api/prices/export/:id?format=xlsx
  private async export(req: Request, res: Response) {
    const { id } = req.params;
    const { format = 'xlsx' } = req.query;

    const useCase = new ExportPricesUseCase(this.priceRepository);
    const buffer = await useCase.execute({ priceId: id, format: format as 'xlsx' | 'csv' });

    const filename = `price_${id}.${format}`;
    
    res.setHeader('Content-Type', format === 'xlsx' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(buffer);
  }

  // Існуючі методи...
  private async getAll(req: Request, res: Response) { /* ... */ }
  private async getById(req: Request, res: Response) { /* ... */ }
  private async create(req: Request, res: Response) { /* ... */ }
  private async update(req: Request, res: Response) { /* ... */ }
  private async activate(req: Request, res: Response) { /* ... */ }
  private async deactivate(req: Request, res: Response) { /* ... */ }

  getRouter(): Router {
    return this.router;
  }
}
```

---

### 1.5 Додаткові залежності

**Файл:** `server/package.json`

```json
{
  "dependencies": {
    "xlsx": "^0.18.5",
    "multer": "^1.4.5-lts.1"
  }
}
```

**Встановити:**
```bash
npm install xlsx multer
npm install -D @types/multer
```

---

### 1.6 Middleware для завантаження файлів

**Файл:** `server/src/common/middleware/upload.middleware.ts`

```typescript
import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/vnd.ms-excel',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
```

---

## 📦 Частина 2: Frontend

### 2.1 Типи даних

**Файл:** `client/src/types/price.ts`

```typescript
export interface PriceEntry {
  code: string;
  name: string;
  price: number;
}

export interface PriceCategory {
  [code: string]: PriceEntry;
}

export interface PriceCategories {
  supports: {
    [type: string]: {
      edge: PriceEntry;
      intermediate: PriceEntry;
    };
  };
  spans: {
    [length: string]: PriceEntry;
  };
  vertical_supports: {
    [type: string]: PriceEntry;
  };
  diagonal_brace: PriceEntry;
  isolator: PriceEntry;
}

export interface Price {
  id: string;
  name: string;
  description?: string;
  categories: PriceCategories;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PriceEditItem {
  category: string;
  code: string;
  price: number;
  isChanged?: boolean;
}

export interface BulkUpdateResult {
  updated: number;
  skipped: number;
}

export interface PriceImportResult {
  priceId: string;
  imported: number;
}
```

---

### 2.2 API Service

**Файл:** `client/src/services/priceAdmin.service.ts`

```typescript
import { apiClient } from './api.client';
import type { Price, PriceEditItem, BulkUpdateResult, PriceImportResult } from '@/types/price';

export const priceAdminService = {
  // Отримати всі прайси
  async getAllPrices(): Promise<Price[]> {
    const { data } = await apiClient.get('/prices');
    return data;
  },

  // Отримати прайс по ID
  async getPriceById(id: string): Promise<Price> {
    const { data } = await apiClient.get(`/prices/${id}`);
    return data;
  },

  // Масове оновлення цін
  async bulkUpdate(priceId: string, items: PriceEditItem[]): Promise<BulkUpdateResult> {
    const { data } = await apiClient.put('/prices/bulk', { priceId, items });
    return data.data;
  },

  // Імпорт прайсу з файлу
  async importPrice(file: File, name: string, description?: string): Promise<PriceImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }

    const { data } = await apiClient.post('/prices/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  // Експорт прайсу
  async exportPrice(id: string, format: 'xlsx' | 'csv' = 'xlsx'): Promise<Blob> {
    const { data } = await apiClient.get(`/prices/export/${id}?format=${format}`, {
      responseType: 'blob',
    });
    return data;
  },

  // Активувати прайс
  async activatePrice(id: string): Promise<void> {
    await apiClient.post(`/prices/${id}/activate`);
  },

  // Деактивувати прайс
  async deactivatePrice(id: string): Promise<void> {
    await apiClient.post(`/prices/${id}/deactivate`);
  },
};
```

---

### 2.3 Компоненти

#### Компонент 1: PriceTableEditor

**Файл:** `client/src/components/admin/PriceTableEditor.tsx`

```typescript
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import type { Price, PriceEditItem } from '@/types/price';

interface PriceTableEditorProps {
  price: Price;
  onSave: (items: PriceEditItem[]) => Promise<void>;
}

export const PriceTableEditor: React.FC<PriceTableEditorProps> = ({ price, onSave }) => {
  const [editedCells, setEditedCells] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Перетворити категорії на плоский список для таблиці
  const tableRows = useMemo(() => {
    const rows: Array<{
      category: string;
      categoryName: string;
      code: string;
      name: string;
      price: number;
      path: string;
    }> = [];

    const categories = price.categories as any;
    
    for (const [categoryName, categoryData] of Object.entries(categories)) {
      // Рекурсивно обійти nested об'єкти
      const traverse = (obj: any, path: string, displayName: string) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object' && value !== null && value.code) {
            rows.push({
              category: categoryName,
              categoryName: formatCategoryName(categoryName),
              code: value.code,
              name: value.name || key,
              price: value.price,
              path: `${path}.${key}`,
            });
          } else if (typeof value === 'object' && value !== null) {
            traverse(value, `${path}.${key}`, `${displayName} > ${key}`);
          }
        }
      };
      
      traverse(categoryData, categoryName, categoryName);
    }

    return rows;
  }, [price]);

  const handleCellEdit = (path: string, newPrice: number) => {
    setEditedCells(prev => ({
      ...prev,
      [path]: newPrice,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const items: PriceEditItem[] = Object.entries(editedCells).map(([path, price]) => {
      const row = tableRows.find(r => r.path === path)!;
      return {
        category: row.category,
        code: row.code,
        price,
      };
    });

    try {
      await onSave(items);
      setEditedCells({});
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(editedCells).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Редагування прайсу: {price.name}</span>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary">
                {Object.keys(editedCells).length} змін
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditedCells({})}
              disabled={!hasChanges}
            >
              <X className="w-4 h-4 mr-2" />
              Скасувати
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Зберегти ({isSaving ? '...' : Object.keys(editedCells).length})
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Категорія</TableHead>
                <TableHead className="w-[100px]">Код</TableHead>
                <TableHead>Назва</TableHead>
                <TableHead className="w-[150px] text-right">Ціна, ₴</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row) => {
                const isEdited = row.path in editedCells;
                const currentValue = isEdited ? editedCells[row.path] : row.price;

                return (
                  <TableRow key={row.path} className={isEdited ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}>
                    <TableCell className="font-medium">{row.categoryName}</TableCell>
                    <TableCell className="font-mono text-sm">{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={currentValue}
                        onChange={(e) => handleCellEdit(row.path, parseFloat(e.target.value) || 0)}
                        className="w-[120px] ml-auto text-right font-mono"
                        step="0.01"
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

function formatCategoryName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}
```

---

#### Компонент 2: PriceImportModal

**Файл:** `client/src/components/admin/PriceImportModal.tsx`

```typescript
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { toast } from 'sonner';

interface PriceImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File, name: string, description?: string) => Promise<void>;
}

export const PriceImportModal: React.FC<PriceImportModalProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
    } else {
      toast.error('Будь ласка, завантажте файл Excel (.xlsx) або CSV');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file || !name.trim()) {
      toast.error('Будь ласка, заповніть всі обов'язкові поля');
      return;
    }

    setIsUploading(true);
    try {
      await onImport(file, name, description);
      toast.success('Прайс успішно імпортовано');
      handleClose();
    } catch (error) {
      toast.error('Помилка імпорту: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Імпорт прайсу</DialogTitle>
          <DialogDescription>
            Завантажте файл Excel або CSV з цінами
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Drop Zone */}
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Перетягніть файл сюди або натисніть для вибору
                </p>
                <Input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" asChild>
                  <Button variant="outline" className="mt-2">
                    Обрати файл
                  </Button>
                </Label>
              </div>
            )}
          </div>

          {/* Назва */}
          <div className="grid gap-2">
            <Label htmlFor="price-name">Назва прайсу *</Label>
            <Input
              id="price-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Напр. Прайс 2024-Q2"
            />
          </div>

          {/* Опис */}
          <div className="grid gap-2">
            <Label htmlFor="price-description">Опис (опціонально)</Label>
            <Textarea
              id="price-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Короткий опис прайсу"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Скасувати
          </Button>
          <Button onClick={handleImport} disabled={!file || !name || isUploading}>
            {isUploading ? 'Імпорт...' : 'Імпортувати'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

#### Компонент 3: PriceExportButton

**Файл:** `client/src/components/admin/PriceExportButton.tsx`

```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { priceAdminService } from '@/services/priceAdmin.service';

interface PriceExportButtonProps {
  priceId: string;
  priceName: string;
}

export const PriceExportButton: React.FC<PriceExportButtonProps> = ({
  priceId,
  priceName,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'xlsx' | 'csv') => {
    setIsExporting(true);
    try {
      const blob = await priceAdminService.exportPrice(priceId, format);
      
      // Створити посилання для завантаження
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${priceName}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Експортовано у форматі ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Помилка експорту: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Експорт...' : 'Експорт'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

### 2.4 Сторінка Admin Prices

**Файл:** `client/src/pages/admin/PricesPage.tsx`

```typescript
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Upload, Download, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { priceAdminService } from '@/services/priceAdmin.service';
import { PriceTableEditor } from '@/components/admin/PriceTableEditor';
import { PriceImportModal } from '@/components/admin/PriceImportModal';
import { PriceExportButton } from '@/components/admin/PriceExportButton';
import type { Price } from '@/types/price';

export const PricesPage: React.FC = () => {
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Отримати список прайсів
  const { data: prices, refetch } = useQuery({
    queryKey: ['prices'],
    queryFn: () => priceAdminService.getAllPrices(),
  });

  // Мутація для масового оновлення
  const bulkUpdateMutation = useMutation({
    mutationFn: async (items: any[]) => {
      if (!selectedPrice) throw new Error('No price selected');
      return priceAdminService.bulkUpdate(selectedPrice.id, items);
    },
    onSuccess: (data) => {
      toast.success(`Оновлено: ${data.updated}, пропущено: ${data.skipped}`);
      refetch();
    },
    onError: (error) => {
      toast.error('Помилка оновлення: ' + error.message);
    },
  });

  // Мутація для імпорту
  const importMutation = useMutation({
    mutationFn: async ({ file, name, description }: { file: File; name: string; description?: string }) => {
      return priceAdminService.importPrice(file, name, description);
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Мутація для активації/деактивації
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (isActive) {
        return priceAdminService.deactivatePrice(id);
      } else {
        return priceAdminService.activatePrice(id);
      }
    },
    onSuccess: () => {
      refetch();
      toast.success('Статус оновлено');
    },
  });

  const handleSave = async (items: any[]) => {
    await bulkUpdateMutation.mutateAsync(items);
  };

  const handleImport = async (file: File, name: string, description?: string) => {
    await importMutation.mutateAsync({ file, name, description });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Управління прайсами</h1>
          <p className="text-muted-foreground">
            Редагування, імпорт та експорт прайс-листів
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Імпорт
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Список прайсів */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Прайс-листи</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {prices?.map((price) => (
                  <div
                    key={price.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPrice?.id === price.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedPrice(price)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{price.name}</div>
                      {price.isActive && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Активний
                        </Badge>
                      )}
                    </div>
                    {price.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {price.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(price.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{Object.keys(price.categories).length} категорій</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActiveMutation.mutate({ id: price.id, isActive: price.isActive });
                        }}
                      >
                        {price.isActive ? (
                          <XCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        )}
                        {price.isActive ? 'Деактивувати' : 'Активувати'}
                      </Button>
                      <PriceExportButton
                        priceId={price.id}
                        priceName={price.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Редактор прайсу */}
        <Card className="md:col-span-2">
          {selectedPrice ? (
            <PriceTableEditor
              key={selectedPrice.id}
              price={selectedPrice}
              onSave={handleSave}
            />
          ) : (
            <CardContent className="flex items-center justify-center h-[600px]">
              <div className="text-center text-muted-foreground">
                <Edit2 className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">Оберіть прайс для редагування</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Модальне вікно імпорту */}
      <PriceImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImport}
      />
    </div>
  );
};
```

---

### 2.5 Роутинг

**Файл:** `client/src/App.tsx`

```typescript
// Додати route
<Route 
  path="/admin/prices" 
  element={
    <ProtectedRoute requiredRole="admin">
      <PricesPage />
    </ProtectedRoute>
  } 
/>
```

**Файл:** `client/src/components/layout/Sidebar.tsx`

```typescript
// Додати посилання в ADMIN розділ
{role === 'admin' && (
  <>
    <NavLink to="/admin/audit">
      <FileText className="w-4 h-4 mr-2" />
      Аудит
    </NavLink>
    <NavLink to="/admin/prices">
      <DollarSign className="w-4 h-4 mr-2" />
      Прайси
    </NavLink>
  </>
)}
```

---

## ✅ Чеклист готовності

### Backend

- [ ] Оновити Prisma schema (індекси)
- [ ] Створити DTO для bulk update та import
- [ ] Створити Use-case: BulkUpdatePrices
- [ ] Створити Use-case: ImportPrices
- [ ] Створити Use-case: ExportPrices
- [ ] Оновити PriceController (нові endpoints)
- [ ] Додати middleware upload (multer)
- [ ] Встановити залежності (xlsx, multer)
- [ ] Написати unit-тести для use-cases
- [ ] Протестувати API через Postman

### Frontend

- [ ] Створити типи даних (price.ts)
- [ ] Створити priceAdmin.service.ts
- [ ] Створити PriceTableEditor компонент
- [ ] Створити PriceImportModal компонент
- [ ] Створити PriceExportButton компонент
- [ ] Створити PricesPage сторінку
- [ ] Додати route /admin/prices
- [ ] Додати посилання в Sidebar
- [ ] Протестувати імпорт/експорт
- [ ] Протестувати inline editing

---

## 📊 Оцінка часу

| Завдання                     | Оцінка    |
| ---------------------------- | --------- |
| **Backend**                  |           |
| DTO та валідація             | 2 год     |
| Use-case: BulkUpdatePrices   | 3 год     |
| Use-case: ImportPrices       | 3 год     |
| Use-case: ExportPrices       | 3 год     |
| Controller + routes          | 2 год     |
| Тести                        | 3 год     |
| **Frontend**                 |           |
| Типи + Service               | 1 год     |
| PriceTableEditor             | 4 год     |
| PriceImportModal             | 3 год     |
| PriceExportButton            | 1 год     |
| PricesPage                   | 3 год     |
| Інтеграція + тести           | 3 год     |
| **Разом**                    | **~28 год** |

---

## 🔗 Посилання

- [PLAN.md](./PLAN.md) — загальний план розробки
- [STATUS.md](./STATUS.md) — статус проєкту
- [price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md) — структура бази цін
