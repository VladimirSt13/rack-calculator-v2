import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, Home, Settings, Shield, ShoppingCart, Warehouse } from 'lucide-react'
import { useState } from 'react'

const mainMenu = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    title: 'Стеллажи',
    icon: Warehouse,
    href: '#',
    children: [
      { title: 'Калькулятор', href: '/rack/calculator' },
      { title: 'Подбор батареи', href: '/rack/battery' },
    ],
  },
  {
    title: 'Настройки',
    icon: Settings,
    href: '/settings',
  },
  {
    title: 'Админка',
    icon: Shield,
    href: '#',
    children: [{ title: 'Аудит логов', href: '/admin/audit' }],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  return (
    <div className={cn('flex h-full flex-col bg-muted/40', className)}>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {mainMenu.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => toggleItem(item.title)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                    <ChevronDown
                      className={cn(
                        'ml-auto h-4 w-4 transition-transform',
                        openItems.includes(item.title) && 'rotate-180'
                      )}
                    />
                  </Button>
                  {openItems.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                      {item.children.map((child) => (
                        <Button
                          key={child.title}
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => (window.location.href = child.href)}
                        >
                          {child.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => (window.location.href = item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              )}
            </div>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Secondary menu */}
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => (window.location.href = '/profile')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Профиль
          </Button>
        </nav>
      </ScrollArea>
    </div>
  )
}
