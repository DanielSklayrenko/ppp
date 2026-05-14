import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { services, getOrdersByUser } = useServices();
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== 'executor') {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Доступ ограничен</h1>
          <p className="text-gray-400 mb-6">
            Эта страница доступна только для исполнителей
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Обновить профиль
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const userServices = services.filter(s => s.sellerId === user.id);
  const sellerOrders = getOrdersByUser(user.id, 'seller');

  const stats = {
    totalEarnings: sellerOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0),
    activeOrders: sellerOrders.filter(o => o.status === 'in_progress' || o.status === 'pending').length,
    completedOrders: sellerOrders.filter(o => o.status === 'completed').length,
    pendingOrders: sellerOrders.filter(o => o.status === 'pending').length,
    avgRating: userServices.length > 0 
      ? (userServices.reduce((sum, s) => sum + s.rating, 0) / userServices.length).toFixed(1)
      : '0.0'
  };

  const recentOrders = sellerOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель исполнителя</h1>
            <p className="text-gray-400">Управляйте своими услугами и заказами</p>
          </div>
          <button
            onClick={() => navigate('/create-service')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            + Новая услуга
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">Заработано</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalEarnings.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">В работе</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.activeOrders}</div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 backdrop-blur-lg border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">Завершено</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.completedOrders}</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">Рейтинг</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.avgRating}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Последние заказы</h2>
              <button
                onClick={() => navigate('/orders')}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                Все заказы →
              </button>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/messages/${order.id}`)}
                    className="p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{order.serviceTitle}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'delivered' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status === 'completed' ? '✓' :
                         order.status === 'in_progress' ? '⏳' :
                         order.status === 'delivered' ? '📦' : '⏰'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{order.buyerName}</span>
                      <span>{order.price.toLocaleString()} ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-400">Пока нет заказов</p>
              </div>
            )}
          </div>

          {/* My Services */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Мои услуги</h2>
              <button
                onClick={() => navigate('/create-service')}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                + Создать
              </button>
            </div>

            {userServices.length > 0 ? (
              <div className="space-y-4">
                {userServices.slice(0, 5).map((service) => (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium truncate">{service.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                        <span>{service.price.toLocaleString()} ₽</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {service.rating}
                        </span>
                        <span>•</span>
                        <span className={service.isActive ? 'text-green-400' : 'text-red-400'}>
                          {service.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-400 mb-4">У вас пока нет услуг</p>
                <button
                  onClick={() => navigate('/create-service')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Создать первую услугу
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pending Orders Alert */}
        {stats.pendingOrders > 0 && (
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Ожидают подтверждения</h3>
                <p className="text-gray-400 text-sm">
                  У вас есть {stats.pendingOrders} {stats.pendingOrders === 1 ? 'заказ' : stats.pendingOrders < 5 ? 'заказа' : 'заказов'}, которые требуют вашего внимания
                </p>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Просмотреть
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
