import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, checkAuth, logout, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </AppLayout>
    )
  }

  if (!user) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Доступ заборонено</CardTitle>
            <CardDescription>Будь ласка, увійдіть в систему</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')}>Увійти</Button>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  const roleLabel = user.role === 'ADMIN' ? 'Адміністратор' : 'Користувач'
  const roleName = (user.role || 'USER').toLowerCase()

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Профіль користувача</h1>
          <p className="text-muted-foreground">Інформація про ваш акаунт</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Основна інформація</CardTitle>
            <CardDescription>Ваші персональні дані та налаштування</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Ім'я</p>
                <p className="font-medium">{user.firstName || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Прізвище</p>
                <p className="font-medium">{user.lastName || '—'}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Роль</p>
                <Badge variant={roleName === 'admin' ? 'destructive' : 'secondary'}>
                  {roleLabel}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email підтверджено</p>
                <p className={user.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
                  {user.emailVerified ? '✓ Так' : '○ Ні'}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground text-sm">Дата реєстрації</p>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString('uk-UA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Налаштування
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Вийти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
