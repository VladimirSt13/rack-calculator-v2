import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AuditFilters, AuditStatus, AuditAction, AuditResource } from '@/types/audit.types'

interface AuditLogFiltersProps {
  onFilter: (filters: AuditFilters) => void
  onReset: () => void
}

const STATUS_OPTIONS: { value: AuditStatus; label: string }[] = [
  { value: 'SUCCESS', label: 'Успех' },
  { value: 'FAILURE', label: 'Неудача' },
  { value: 'ERROR', label: 'Ошибка' },
]

const RESOURCE_OPTIONS: { value: AuditResource; label: string }[] = [
  { value: 'auth', label: 'Аутентификация' },
  { value: 'users', label: 'Пользователи' },
  { value: 'roles', label: 'Роли' },
  { value: 'permissions', label: 'Разрешения' },
  { value: 'rack', label: 'Стеллажи' },
  { value: 'battery', label: 'Батареи' },
  { value: 'export', label: 'Экспорт' },
]

const ACTION_OPTIONS: { value: AuditAction; label: string }[] = [
  { value: 'LOGIN', label: 'Вход' },
  { value: 'LOGOUT', label: 'Выход' },
  { value: 'REGISTER', label: 'Регистрация' },
  { value: 'USER_CREATE', label: 'Создание пользователя' },
  { value: 'USER_UPDATE', label: 'Обновление пользователя' },
  { value: 'USER_DELETE', label: 'Удаление пользователя' },
  { value: 'ROLE_CREATE', label: 'Создание роли' },
  { value: 'ROLE_UPDATE', label: 'Обновление роли' },
  { value: 'ROLE_DELETE', label: 'Удаление роли' },
  { value: 'RACK_CALCULATE', label: 'Расчёт стеллажа' },
  { value: 'RACK_SAVE', label: 'Сохранение стеллажа' },
  { value: 'RACK_DELETE', label: 'Удаление стеллажа' },
]

export function AuditLogFilters({ onFilter, onReset }: AuditLogFiltersProps) {
  const { control, handleSubmit, reset } = useForm<AuditFilters>()

  const onSubmit = (data: AuditFilters) => {
    onFilter(data)
  }

  const handleReset = () => {
    reset()
    onReset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Статус</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Resource */}
        <div className="space-y-2">
          <Label htmlFor="resource">Ресурс</Label>
          <Controller
            name="resource"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="resource">
                  <SelectValue placeholder="Все ресурсы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все ресурсы</SelectItem>
                  {RESOURCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Action */}
        <div className="space-y-2">
          <Label htmlFor="action">Действие</Label>
          <Controller
            name="action"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="Все действия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все действия</SelectItem>
                  {ACTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Период</Label>
          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  placeholder="С"
                  className="text-sm"
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  placeholder="По"
                  className="text-sm"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button type="submit">Применить</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </form>
  )
}
