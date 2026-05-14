import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getServiceById, categories, reviews, createOrder, addMessage } = useServices();
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const service = id ? getServiceById(id) : undefined;

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Услуга не найдена</h1>
          <Link to="/services" className="text-slate-400 hover:text-slate-300">
            Вернуться к каталогу
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceReviews = reviews.filter(r => r.serviceId === service.id);
  const category = categories.find(c => c.id === service.category);

  const handleOrder = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setIsOrdering(true);
    
    const order = createOrder({
      serviceId: service.id,
      serviceTitle: service.title,
      serviceImage: service.images[0],
      buyerId: user.id,
      buyerName: user.name,
      sellerId: service.sellerId,
      sellerName: service.sellerName,
      price: service.price,
      requirements,
      deliveryDate: new Date(Date.now() + service.deliveryTime * 24 * 60 * 60 * 1000),
      message: requirements || 'Нет дополнительных требований'
    });

    // Send initial message
    addMessage({
      orderId: order.id,
      senderId: user.id,
      senderName: user.name,
      content: `Здравствуйте! Я заказал вашу услугу "${service.title}". Требования: ${requirements || 'Нет дополнительных требований'}`
    });

    setIsOrdering(false);
    setShowOrderModal(false);
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video bg-slate-700/50 rounded-2xl overflow-hidden flex items-center justify-center text-8xl">
              {category?.icon || '📦'}
            </div>

            {/* Title & Info */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                <Link to="/services" className="hover:text-slate-300">Услуги</Link>
                <span>/</span>
                <Link to={`/services?category=${service.category}`} className="hover:text-slate-300">
                  {category?.name}
                </Link>
                {service.subcategory && (
                  <>
                    <span>/</span>
                    <span>{service.subcategory}</span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">{service.title}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-medium">{service.rating}</span>
                  <span className="text-gray-400">({service.reviewsCount} отзывов)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{service.ordersCount} заказов</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-white mb-3">Описание</h2>
                <p className="text-gray-300 whitespace-pre-line">{service.description}</p>
              </div>

              {/* Tags */}
              {service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            {serviceReviews.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Отзывы ({serviceReviews.length})
                </h2>
                <div className="space-y-6">
                  {serviceReviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium">
                          {review.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{review.authorName}</p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm ml-auto">
                          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {service.sellerName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{service.sellerName}</h3>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white">{service.sellerRating}</span>
                    <span className="text-gray-400 text-sm">({service.reviewsCount} отзывов)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{service.ordersCount}</div>
                  <div className="text-gray-400 text-sm">Заказов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{service.deliveryTime} дн.</div>
                  <div className="text-gray-400 text-sm">Срок</div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-slate-700/30 backdrop-blur-lg border border-slate-600 rounded-2xl p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-gray-400 text-sm">Стоимость</span>
                <div className="text-3xl font-bold text-white">
                  {service.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Срок: {service.deliveryTime} дней</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Безопасная сделка</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Гарантия возврата</span>
                </div>
              </div>

              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full py-4 bg-slate-700 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-600 transition-all duration-200"
              >
                {isAuthenticated ? 'Заказать услугу' : 'Войти для заказа'}
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                Нажимая кнопку, вы принимаете условия сервиса
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Оформление заказа</h2>
            <p className="text-gray-400 mb-6">
              {service.title}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Требования к заказу
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Опишите подробно, что вам нужно..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-gray-300">Итого:</span>
                <span className="text-2xl font-bold text-white">
                  {service.price.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-3 px-4 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleOrder}
                  disabled={isOrdering}
                  className="flex-1 py-3 px-4 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all disabled:opacity-50"
                >
                  {isOrdering ? 'Обработка...' : 'Подтвердить заказ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ServiceDetail;
