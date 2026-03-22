import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AuditLog } from '@/types/audit.types'

interface AuditLogTableProps {
  logs: AuditLog[]
  onViewDetails: (log: AuditLog) => void
}

const statusVariants: Record<string, 'default' | 'destructive' | 'secondary'> = {
  SUCCESS: 'default',
  FAILURE: 'destructive',
  ERROR: 'destructive',
}

const resourceLabels: Record<string, string> = {
  auth: 'Аутентификация',
  users: 'Пользователи',
  roles: 'Роли',
  permissions: 'Разрешения',
  rack: 'Стеллажи',
  battery: 'Батареи',
  export: 'Экспорт',
}

const actionLabels: Record<string, string> = {
  LOGIN: 'Вход',
  LOGOUT: 'Выход',
  REGISTER: 'Регистрация',
  USER_CREATE: 'Создание пользователя',
  USER_UPDATE: 'Обновление пользователя',
  USER_DELETE: 'Удаление пользователя',
  ROLE_CREATE: 'Создание роли',
  ROLE_UPDATE: 'Обновление роли',
  ROLE_DELETE: 'Удаление роли',
  RACK_CALCULATE: 'Расчёт стеллажа',
  RACK_SAVE: 'Сохранение стеллажа',
  RACK_DELETE: 'Удаление стеллажа',
}

export function AuditLogTable({ logs, onViewDetails }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Логи не найдены</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата/Время</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действие</TableHead>
            <TableHead>Ресурс</TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Детали</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-sm">
                {new Date(log.createdAt).toLocaleString('ru-RU')}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[log.status] || 'secondary'}>
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {actionLabels[log.action] || log.action}
              </TableCell>
              <TableCell>
                {resourceLabels[log.resource] || log.resource}
              </TableCell>
              <TableCell>
                {log.user
                  ? `${log.user.firstName || ''} ${log.user.lastName || ''} (${log.user.email})`
                  : '—'}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {log.ipAddress || '—'}
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onViewDetails(log)}
                  className="text-sm text-primary hover:underline"
                >
                  Подробнее
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
