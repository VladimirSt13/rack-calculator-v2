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
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </AppLayout>
    )
  }

  if (!user) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Доступ запрещён</CardTitle>
            <CardDescription>Пожалуйста, войдите в систему</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')}>Войти</Button>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  const roleLabel = user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'
  const roleName = (user.role || 'USER').toLowerCase()

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Профиль пользователя</h1>
          <p className="text-muted-foreground">Информация о вашем аккаунте</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
            <CardDescription>Ваши персональные данные и настройки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Имя</p>
                <p className="font-medium">{user.firstName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Фамилия</p>
                <p className="font-medium">{user.lastName || '—'}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Роль</p>
                <Badge variant={roleName === 'admin' ? 'destructive' : 'secondary'}>
                  {roleLabel}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email подтверждён</p>
                <p className={user.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
                  {user.emailVerified ? '✓ Да' : '○ Нет'}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Дата регистрации</p>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Настройки
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
