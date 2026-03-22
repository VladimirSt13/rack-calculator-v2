import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function RackCalculatorPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Калькулятор стеллажей</h1>
          <p className="text-muted-foreground">
            Расчёт конфигурации и стоимости стеллажного оборудования
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>В разработке</CardTitle>
            <CardDescription>
              Калькулятор стеллажей будет доступен в следующем обновлении
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">
                🚧 Страница в разработке...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
