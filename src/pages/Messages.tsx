import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Messages: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, getMessagesByOrder, addMessage, markMessagesRead } = useServices();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

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

  const userOrders = orders.filter(o => o.buyerId === user.id || o.sellerId === user.id);
  
  const getOrderWithMessages = (order: any) => {
    const messages = getMessagesByOrder(order.id);
    const unreadCount = messages.filter(m => !m.isRead && m.senderId !== user.id).length;
    const lastMessage = messages[messages.length - 1];
    const otherParty = order.buyerId === user.id ? order.sellerName : order.buyerName;
    
    return {
      order,
      messages,
      unreadCount,
      lastMessage,
      otherParty
    };
  };

  const ordersWithMessages = userOrders.map(getOrderWithMessages).sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const selectedOrderData = selectedOrderId ? ordersWithMessages.find(o => o.order.id === selectedOrderId) : null;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedOrderId) return;
    
    addMessage({
      orderId: selectedOrderId,
      senderId: user.id,
      senderName: user.name,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  if (selectedOrderData && selectedOrderId) {
    // Mark messages as read
    markMessagesRead(selectedOrderId, user.id);

    return (
      <div className="min-h-screen bg-slate-900">
        <Header />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="mr-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedOrderData.otherParty}</h1>
              <p className="text-gray-400 text-sm">{selectedOrderData.order.serviceTitle}</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {selectedOrderData.messages.length > 0 ? (
                selectedOrderData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.senderId === user.id
                          ? 'bg-purple-600 text-white rounded-br-md'
                          : 'bg-white/10 text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.senderId === user.id ? 'text-purple-200' : 'text-gray-400'}`}>
                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-gray-400">Нет сообщений</p>
                  <p className="text-gray-500 text-sm">Начните обсуждение заказа</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Сообщения</h1>

        {ordersWithMessages.length > 0 ? (
          <div className="space-y-3">
            {ordersWithMessages.map(({ order, otherParty, lastMessage, unreadCount }) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {otherParty.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">{otherParty}</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate">
                    {lastMessage ? lastMessage.content : 'Нет сообщений'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {order.serviceTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Нет сообщений</h3>
            <p className="text-gray-400 mb-6">
              Сообщения появятся после создания заказа
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Найти услуги
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Messages;
