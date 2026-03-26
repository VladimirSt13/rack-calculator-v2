import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { PriceDisplay } from './PriceDisplay'
import type { RackResult } from '@/types/rack'

interface PreambleCardProps {
  result: RackResult
}

/**
 * Картка коротких результатів розрахунку
 */
export function PreambleCard({ result }: PreambleCardProps) {
  // Підрахунок кількості прольотів
  const totalSpans = result.configuration.spans.reduce((sum, span) => sum + span.quantity, 0)

  // Підрахунок кількості балок
  const totalBeams = result.components.beams.reduce((sum, beam) => sum + beam.quantity, 0)

  // Підрахунок кількості опор
  const totalSupports = result.components.supports.reduce(
    (sum, support) => sum + support.quantity,
    0
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <CardTitle className="text-base">Результати розрахунку</CardTitle>
        </div>
        {/* Назва стелажа */}
        <div className="mt-2">
          <p className="text-lg font-semibold">{result.name}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Прольотів */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Прольотів</p>
            <p className="text-2xl font-bold">{totalSpans}</p>
          </div>

          {/* Балок */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Балок</p>
            <p className="text-2xl font-bold">{totalBeams} шт</p>
          </div>

          {/* Опор */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Опор</p>
            <p className="text-2xl font-bold">{totalSupports} шт</p>
          </div>

          {/* Вартість */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Вартість</p>
            <PriceDisplay value={result.pricing.zero} size="xl" variant="success" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
