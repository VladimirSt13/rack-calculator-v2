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
  auth: 'Аутентифікація',
  users: 'Користувачі',
  roles: 'Ролі',
  permissions: 'Дозволи',
  rack: 'Стелажі',
  battery: 'Батареї',
  export: 'Експорт',
}

const actionLabels: Record<string, string> = {
  LOGIN: 'Вхід',
  LOGOUT: 'Вихід',
  REGISTER: 'Реєстрація',
  USER_CREATE: 'Створення користувача',
  USER_UPDATE: 'Оновлення користувача',
  USER_DELETE: 'Видалення користувача',
  ROLE_CREATE: 'Створення ролі',
  ROLE_UPDATE: 'Оновлення ролі',
  ROLE_DELETE: 'Видалення ролі',
  RACK_CALCULATE: 'Розрахунок стелажа',
  RACK_SAVE: 'Збереження стелажа',
  RACK_DELETE: 'Видалення стелажа',
}

export function AuditLogTable({ logs, onViewDetails }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">Логи не знайдено</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата/Час</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дія</TableHead>
            <TableHead>Ресурс</TableHead>
            <TableHead>Користувач</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Деталі</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-sm">
                {new Date(log.createdAt).toLocaleString('uk-UA')}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[log.status] || 'secondary'}>{log.status}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                {actionLabels[log.action] || log.action}
              </TableCell>
              <TableCell>{resourceLabels[log.resource] || log.resource}</TableCell>
              <TableCell>
                {log.user
                  ? `${log.user.firstName || ''} ${log.user.lastName || ''} (${log.user.email})`
                  : '—'}
              </TableCell>
              <TableCell className="font-mono text-sm">{log.ipAddress || '—'}</TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onViewDetails(log)}
                  className="text-primary text-sm hover:underline"
                >
                  Детальніше
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
