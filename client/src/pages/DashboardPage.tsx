import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Battery, Settings, Users } from 'lucide-react'

export function DashboardPage() {
  const stats = [
    {
      title: 'Расчёты стеллажей',
      value: '12',
      description: 'В этом месяце',
      icon: Package,
    },
    {
      title: 'Подбор батарей',
      value: '8',
      description: 'В этом месяце',
      icon: Battery,
    },
    {
      title: 'Пользователи',
      value: '24',
      description: 'В системе',
      icon: Users,
    },
    {
      title: 'Настройки',
      value: '3',
      description: 'Активные',
      icon: Settings,
    },
  ]

  const recentProjects = [
    {
      name: 'Стеллаж L2A2-1950/80',
      status: 'completed',
      date: '2026-03-20',
    },
    {
      name: 'Стеллаж L1A1C-1500/80',
      status: 'pending',
      date: '2026-03-19',
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Добро пожаловать в систему расчёта стеллажного оборудования
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Последние расчёты</CardTitle>
              <CardDescription>
                Ваши последние проекты и расчёты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {project.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        project.status === 'completed' ? 'default' : 'secondary'
                      }
                    >
                      {project.status === 'completed' ? 'Готов' : 'В процессе'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>
                Начните новый расчёт
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/rack/calculator"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium">Расчёт стеллажа</span>
                <Package className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="/rack/battery"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium">Подбор батареи</span>
                <Battery className="h-4 w-4 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
