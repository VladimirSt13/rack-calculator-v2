import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout'
import { AuditLogFilters, AuditLogTable, AuditLogDetail } from '@/components/audit'
import { auditService } from '@/services/audit.service'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AuditFilters as AuditFiltersType, AuditLog } from '@/types/audit.types'

const DEFAULT_LIMIT = 20

export function AuditPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<AuditFiltersType>({})
  const [skip, setSkip] = useState(0)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', filters, skip],
    queryFn: () =>
      auditService.getLogs({
        ...filters,
        limit: DEFAULT_LIMIT,
        skip,
      }),
  })

  const handleFilter = (newFilters: AuditFiltersType) => {
    setFilters(newFilters)
    setSkip(0)
    queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
  }

  const handleReset = () => {
    setFilters({})
    setSkip(0)
    queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
  }

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setDetailOpen(true)
  }

  const handlePrevious = () => {
    if (skip > 0) {
      setSkip(skip - DEFAULT_LIMIT)
    }
  }

  const handleNext = () => {
    if (data && data.data.pagination.total > skip + DEFAULT_LIMIT) {
      setSkip(skip + DEFAULT_LIMIT)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Аудит логов</h1>
          <p className="text-muted-foreground">
            Просмотр и анализ действий пользователей
          </p>
        </div>

        {/* Filters */}
        <AuditLogFilters onFilter={handleFilter} onReset={handleReset} />

        {/* Table */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : (
          <AuditLogTable logs={data?.data.logs || []} onViewDetails={handleViewDetails} />
        )}

        {/* Pagination */}
        {data && data.data.logs.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Показано {data.data.logs.length} из {data.data.pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={skip === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Назад
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={skip + DEFAULT_LIMIT >= data.data.pagination.total}
              >
                Вперёд
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <AuditLogDetail
          log={selectedLog}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </div>
    </AppLayout>
  )
}
