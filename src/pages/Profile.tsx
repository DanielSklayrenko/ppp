import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { services, getOrdersByUser } = useServices();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || ''
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Войти
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const userServices = services.filter(s => s.sellerId === user.id);
  const buyerOrders = getOrdersByUser(user.id, 'buyer');
  const sellerOrders = getOrdersByUser(user.id, 'seller');

  const handleSave = () => {
    updateUser({
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    });
    setIsEditing(false);
  };

  const stats = {
    services: userServices.length,
    orders: user.role === 'executor' ? sellerOrders.length : buyerOrders.length,
    rating: user.rating,
    reviews: user.reviewsCount
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full md:w-auto px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Расскажите о себе..."
                  />
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Навыки (через запятую)"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-400 mb-3">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.role === 'executor' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'executor' ? 'Исполнитель' : 'Заказчик'}
                    </span>
                    {user.bio && <p className="text-gray-300">{user.bio}</p>}
                  </div>
                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{stats.services}</div>
                <div className="text-gray-400 text-sm">Услуг</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{stats.orders}</div>
                <div className="text-gray-400 text-sm">Заказов</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{stats.rating}</div>
                <div className="text-gray-400 text-sm">Рейтинг</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{stats.reviews}</div>
                <div className="text-gray-400 text-sm">Отзывов</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Services */}
          {user.role === 'executor' && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Мои услуги</h2>
                <button
                  onClick={() => navigate('/create-service')}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  + Создать
                </button>
              </div>
              {userServices.length > 0 ? (
                <div className="space-y-4">
                  {userServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => navigate(`/service/${service.id}`)}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{service.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>{service.price.toLocaleString()} ₽</span>
                          <span>•</span>
                          <span>{service.ordersCount} заказов</span>
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
          )}

          {/* Orders */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              {user.role === 'executor' ? 'Заказы на услуги' : 'Мои заказы'}
            </h2>
            {(user.role === 'executor' ? sellerOrders : buyerOrders).length > 0 ? (
              <div className="space-y-4">
                {(user.role === 'executor' ? sellerOrders : buyerOrders).slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/orders`)}
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
                        {order.status === 'completed' ? 'Завершён' :
                         order.status === 'in_progress' ? 'В работе' :
                         order.status === 'delivered' ? 'Доставлен' :
                         order.status === 'cancelled' ? 'Отменён' : 'Ожидает'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{order.price.toLocaleString()} ₽</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                ))}
                {(user.role === 'executor' ? sellerOrders : buyerOrders).length > 5 && (
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full py-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    Показать все заказы →
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-400">
                  {user.role === 'executor' ? 'Пока нет заказов' : 'Вы ещё не делали заказов'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
