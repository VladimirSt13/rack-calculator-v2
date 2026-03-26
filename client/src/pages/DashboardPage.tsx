import { AppLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Battery, Settings, Users } from 'lucide-react'

export function DashboardPage() {
  const stats = [
    {
      title: 'Розрахунки стелажів',
      value: '12',
      description: 'Цього місяця',
      icon: Package,
    },
    {
      title: 'Підбір батарей',
      value: '8',
      description: 'Цього місяця',
      icon: Battery,
    },
    {
      title: 'Користувачі',
      value: '24',
      description: 'В системі',
      icon: Users,
    },
    {
      title: 'Налаштування',
      value: '3',
      description: 'Активні',
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
            Ласкаво просимо до системи розрахунку стелажного обладнання
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Останні розрахунки</CardTitle>
              <CardDescription>Ваші останні проєкти та розрахунки</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.name} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">{project.name}</p>
                      <p className="text-muted-foreground text-sm">{project.date}</p>
                    </div>
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                      {project.status === 'completed' ? 'Готово' : 'В процесі'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Швидкі дії</CardTitle>
              <CardDescription>Розпочніть новий розрахунок</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/rack/calculator"
                className="hover:bg-muted flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <span className="text-sm font-medium">Розрахунок стелажа</span>
                <Package className="text-muted-foreground h-4 w-4" />
              </a>
              <a
                href="/rack/battery"
                className="hover:bg-muted flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <span className="text-sm font-medium">Підбір батареї</span>
                <Battery className="text-muted-foreground h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
