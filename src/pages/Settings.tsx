import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Settings: React.FC = () => {
  const { user, isAuthenticated, updateUser, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    orders: true,
    messages: true,
    marketing: false
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Требуется авторизация</h1>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Войти
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Введите текущий пароль');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    setIsChangingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (result.success) {
      setPasswordSuccess('Пароль успешно изменён');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.error || 'Ошибка смены пароля');
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Настройки</h1>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Профиль</h2>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                  Изменить аватар
                </button>
                <p className="text-slate-400 text-sm mt-2">JPG, PNG до 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Безопасность</h2>
            
            {passwordError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Текущий пароль
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Введите текущий пароль"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Минимум 6 символов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Повторите новый пароль"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Изменение...' : 'Изменить пароль'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Уведомления</h2>
            
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email уведомления', desc: 'Получать уведомления на email' },
                { key: 'push', label: 'Push уведомления', desc: 'Получать push-уведомления в браузере' },
                { key: 'orders', label: 'Заказы', desc: 'Уведомления о новых заказах и изменениях статуса' },
                { key: 'messages', label: 'Сообщения', desc: 'Уведомления о новых сообщениях' },
                { key: 'marketing', label: 'Маркетинг', desc: 'Новости, акции и специальные предложения' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(item.key as keyof typeof notifications)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-slate-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'left-8' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Опасная зона</h2>
            <p className="text-slate-400 mb-6">
              Эти действия необратимы. Пожалуйста, будьте осторожны.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите выйти?')) {
                    logout();
                    navigate('/');
                  }
                }}
                className="px-6 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Выйти из аккаунта
              </button>
              <button
                onClick={() => alert('Функция удаления аккаунта в разработке')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
