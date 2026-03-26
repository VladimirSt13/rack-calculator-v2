import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/**
 * Skeleton для стану завантаження результатів розрахунку
 */
export function ResultsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" /> {/* Заголовок "Результати розрахунку" */}
        <Skeleton className="h-4 w-64" /> {/* Підзаголовок */}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PreambleCard skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>

        {/* RackNameCard skeleton */}
        <Skeleton className="h-20 w-full" />

        {/* ComponentsTableCard skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" /> {/* Заголовок "Компоненти" */}
          
          {/* Рядки таблиці */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" /> {/* Рядок 1 */}
            <Skeleton className="h-10 w-full" /> {/* Рядок 2 */}
            <Skeleton className="h-10 w-full" /> {/* Рядок 3 */}
            <Skeleton className="h-10 w-full" /> {/* Рядок 4 */}
          </div>

          {/* Блок цін */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-8 w-full" /> {/* Базова ціна */}
            <Skeleton className="h-6 w-full" /> {/* Нульова ціна */}
            <Skeleton className="h-6 w-full" /> {/* Без ізоляторів */}
          </div>

          {/* Кнопка */}
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
