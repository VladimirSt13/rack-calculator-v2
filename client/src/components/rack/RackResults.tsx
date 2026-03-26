import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator } from 'lucide-react'
import { ResultsSkeleton } from './ResultsSkeleton'
import { PreambleCard } from './PreambleCard'
import { ComponentsTableCard } from './ComponentsTableCard'
import type { RackResult } from '@/types/rack'

interface RackResultsProps {
  result: RackResult | null
  isCalculating: boolean
  onAddToSet?: (result: RackResult) => void
}

export function RackResults({ result, isCalculating, onAddToSet }: RackResultsProps) {
  if (isCalculating) {
    return <ResultsSkeleton />
  }

  if (result) {
    return (
      <div className="space-y-6">
        <PreambleCard result={result} />
        <ComponentsTableCard result={result} onAddToSet={onAddToSet} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Результати розрахунку</CardTitle>
        <CardDescription>Виконайте розрахунок для перегляду результатів</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex h-48 items-center justify-center">
          <Calculator className="h-12 w-12 opacity-50" />
        </div>
      </CardContent>
    </Card>
  )
}
