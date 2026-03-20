import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import './profile.css'

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
    return <div className="loading">Загрузка...</div>
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Доступ запрещён</h2>
          <p>Пожалуйста, войдите в систему.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Войти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Профиль пользователя</h1>

        <div className="profile-info">
          <div className="profile-field">
            <label>ID:</label>
            <span>{user.id}</span>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          {user.firstName && (
            <div className="profile-field">
              <label>Имя:</label>
              <span>{user.firstName}</span>
            </div>
          )}

          {user.lastName && (
            <div className="profile-field">
              <label>Фамилия:</label>
              <span>{user.lastName}</span>
            </div>
          )}

          <div className="profile-field">
            <label>Роль:</label>
            <span className={`role-badge role-${user.role.toLowerCase()}`}>
              {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
            </span>
          </div>

          <div className="profile-field">
            <label>Email подтверждён:</label>
            <span className={user.emailVerified ? 'status-verified' : 'status-pending'}>
              {user.emailVerified ? '✓ Да' : '○ Нет'}
            </span>
          </div>

          <div className="profile-field">
            <label>Дата регистрации:</label>
            <span>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-secondary">
          Выйти
        </button>
      </div>
    </div>
  )
}
