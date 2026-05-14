import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Messages: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, getMessagesByOrder, addMessage, markMessagesRead } = useServices();
  const navigate = useNavigate();
  const { orderId: urlOrderId } = useParams<{ orderId: string }>();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Sync with URL parameter
  useEffect(() => {
    if (urlOrderId) {
      setSelectedOrderId(urlOrderId);
    }
  }, [urlOrderId]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOrderId || isSending) return;
    
    setIsSending(true);
    try {
      addMessage({
        orderId: selectedOrderId,
        senderId: user.id,
        senderName: user.name,
        content: newMessage.trim()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenChat = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate(`/messages/${orderId}`);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    navigate('/messages');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && selectedOrderData) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedOrderData?.messages.length]);

  // Mark messages as read when opening chat
  useEffect(() => {
    if (selectedOrderId) {
      markMessagesRead(selectedOrderId, user.id);
    }
  }, [selectedOrderId]);

  // Chat view
  if (selectedOrderData && selectedOrderId) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Header />

        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center mb-6 p-4 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl">
            <button
              onClick={handleBackToList}
              className="mr-4 p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-700 rounded-lg"
              title="Назад к списку"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {selectedOrderData.otherParty.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-white truncate">{selectedOrderData.otherParty}</h1>
              <p className="text-slate-400 text-sm truncate">{selectedOrderData.order.serviceTitle}</p>
            </div>
            <span className="text-xs text-slate-500">
              {selectedOrderData.messages.length} сообщ.
            </span>
          </div>

          {/* Messages Container */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700 rounded-2xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedOrderData.messages.length > 0 ? (
                selectedOrderData.messages.map((message) => {
                  const isOwn = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[80%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwn && (
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {message.senderName.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            isOwn
                              ? 'bg-slate-600 text-white rounded-br-md'
                              : 'bg-slate-700/50 text-white rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-slate-300' : 'text-slate-400'}`}>
                            {new Date(message.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-5xl mb-4">💬</div>
                    <p className="text-slate-400">Нет сообщений</p>
                    <p className="text-slate-500 text-sm mt-1">Начните обсуждение заказа</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-700 p-4 bg-slate-800/50">
              <div className="flex space-x-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите сообщение... (Enter для отправки)"
                  rows={1}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSending ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Messages list view
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Сообщения</h1>
        <p className="text-slate-400 mb-8">
          {ordersWithMessages.length} {ordersWithMessages.length === 1 ? 'диалог' : ordersWithMessages.length < 5 ? 'диалога' : 'диалогов'}
        </p>

        {ordersWithMessages.length > 0 ? (
          <div className="space-y-3">
            {ordersWithMessages.map(({ order, otherParty, lastMessage, unreadCount }) => (
              <div
                key={order.id}
                onClick={() => handleOpenChat(order.id)}
                className="flex items-center space-x-4 p-4 bg-slate-800/30 backdrop-blur-lg border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-slate-600 transition-all"
              >
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {otherParty.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">{otherParty}</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-slate-600 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm truncate">
                    {lastMessage ? lastMessage.content : 'Нет сообщений'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
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
            <p className="text-slate-400 mb-6">
              Сообщения появятся после создания заказа
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
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
