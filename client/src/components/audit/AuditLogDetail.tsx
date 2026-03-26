import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { AuditLog } from '@/types/audit.types'

interface AuditLogDetailProps {
  log: AuditLog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditLogDetail({ log, open, onOpenChange }: AuditLogDetailProps) {
  if (!log) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Деталі логу</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            {/* Header Info */}
            <div className="flex items-center gap-2">
              <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                {log.status}
              </Badge>
              <span className="font-medium">{log.action}</span>
            </div>

            <Separator />

            {/* Main Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Дата/Час</p>
                <p className="font-mono">{new Date(log.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ресурс</p>
                <p className="font-medium">{log.resource}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID ресурсу</p>
                <p className="font-mono">{log.resourceId || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">IP адреса</p>
                <p className="font-mono">{log.ipAddress || '—'}</p>
              </div>
            </div>

            <Separator />

            {/* User Info */}
            <div>
              <p className="text-muted-foreground mb-2">Користувач</p>
              {log.user ? (
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">
                      {log.user.firstName} {log.user.lastName}
                    </span>
                  </p>
                  <p className="text-muted-foreground">{log.user.email}</p>
                  <p className="font-mono text-xs">{log.user.id}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>

            <Separator />

            {/* Message */}
            <div>
              <p className="text-muted-foreground mb-2">Повідомлення</p>
              <p className="text-sm">{log.message || '—'}</p>
            </div>

            <Separator />

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div>
                <p className="text-muted-foreground mb-2">Метадані</p>
                <pre className="bg-muted overflow-auto rounded-lg p-3 text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* User Agent */}
            {log.userAgent && (
              <div>
                <p className="text-muted-foreground mb-2">User Agent</p>
                <p className="text-muted-foreground font-mono text-xs break-all">{log.userAgent}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
