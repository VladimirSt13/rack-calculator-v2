import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Налаштування</h1>
          <p className="text-muted-foreground">Налаштування системи та користувача</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>В розробці</CardTitle>
            <CardDescription>
              Сторінка налаштувань буде доступна в наступному оновленні
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">⚙️ Сторінка в розробці...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
