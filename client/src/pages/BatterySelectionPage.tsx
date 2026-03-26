import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function BatterySelectionPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Підбір батареї</h1>
          <p className="text-muted-foreground">
            Підбір акумуляторних батарей для стелажного обладнання
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>В розробці</CardTitle>
            <CardDescription>Підбір батареї буде доступний в наступному оновленні</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">🔋 Сторінка в розробці...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
