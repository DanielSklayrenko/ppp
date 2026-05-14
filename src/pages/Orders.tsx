import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Orders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByUser, updateOrder, addMessage } = useServices();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'>('all');

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

  const orders = getOrdersByUser(user.id, user.role === 'executor' ? 'seller' : 'buyer');
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'in_progress': return 'В работе';
      case 'delivered': return 'Доставлен';
      case 'completed': return 'Завершён';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'delivered': return 'bg-purple-500/20 text-purple-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const handleAcceptOrder = (order: any) => {
    updateOrder(order.id, { status: 'in_progress' });
    addMessage({
      orderId: order.id,
      senderId: user.id,
      senderName: user.name,
      content: 'Заказ принят в работу. Приступаю к выполнению!'
    });
  };

  const handleDeliverOrder = (order: any) => {
    updateOrder(order.id, { 
      status: 'delivered',
      deliveredAt: new Date()
    });
    addMessage({
      orderId: order.id,
      senderId: user.id,
      senderName: user.name,
      content: 'Заказ выполнен и доставлен! Пожалуйста, проверьте результат.'
    });
  };

  const handleCompleteOrder = (order: any) => {
    updateOrder(order.id, { 
      status: 'completed',
      completedAt: new Date()
    });
  };

  const handleCancelOrder = (order: any) => {
    updateOrder(order.id, { status: 'cancelled' });
    addMessage({
      orderId: order.id,
      senderId: user.id,
      senderName: user.name,
      content: 'Заказ отменён.'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {user.role === 'executor' ? 'Заказы на услуги' : 'Мои заказы'}
          </h1>
          <p className="text-gray-400">
            {orders.length} {orders.length === 1 ? 'заказ' : orders.length < 5 ? 'заказа' : 'заказов'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'in_progress', 'delivered', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'Все' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      📦
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{order.serviceTitle}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span>
                          {user.role === 'executor' ? 'Заказчик:' : 'Исполнитель:'}{' '}
                          <span className="text-white">{user.role === 'executor' ? order.buyerName : order.sellerName}</span>
                        </span>
                        <span>•</span>
                        <span>{order.price.toLocaleString('ru-RU')} ₽</span>
                        <span>•</span>
                        <span>Создан: {new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                        <span>•</span>
                        <span>Срок: {new Date(order.deliveryDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                      {order.requirements && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-400">Требования:</span> {order.requirements}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/messages/${order.id}`)}
                        className="px-4 py-2 bg-white/5 border border-white/20 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
                      >
                        💬 Сообщения
                      </button>

                      {user.role === 'executor' && order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptOrder(order)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Принять
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Отклонить
                          </button>
                        </>
                      )}

                      {user.role === 'executor' && order.status === 'in_progress' && (
                        <button
                          onClick={() => handleDeliverOrder(order)}
                          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Доставить
                        </button>
                      )}

                      {user.role === 'customer' && order.status === 'delivered' && (
                        <button
                          onClick={() => handleCompleteOrder(order)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Подтвердить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">Нет заказов</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? (user.role === 'executor' ? 'У вас пока нет заказов на услуги' : 'Вы ещё не делали заказов')
                : 'В этой категории нет заказов'}
            </p>
            {user.role === 'customer' && filter === 'all' && (
              <button
                onClick={() => navigate('/services')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Найти услуги
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
