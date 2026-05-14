import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const { services, categories } = useServices();
  const navigate = useNavigate();

  const featuredServices = services.filter(s => s.isActive && s.rating >= 4.7).slice(0, 6);
  const topCategories = categories.slice(0, 6);

  const stats = [
    { value: '50K+', label: 'Активных пользователей' },
    { value: '10K+', label: 'Успешных проектов' },
    { value: '4.9', label: 'Средняя оценка' },
    { value: '24/7', label: 'Поддержка' }
  ];

  const features = [
    {
      icon: '🛡️',
      title: 'Безопасные сделки',
      description: 'Гарантированная оплата через безопасную систему escrow'
    },
    {
      icon: '⭐',
      title: 'Проверенные исполнители',
      description: 'Все исполнители проходят верификацию и имеют рейтинг'
    },
    {
      icon: '💬',
      title: 'Прямая коммуникация',
      description: 'Общайтесь с исполнителями напрямую через встроенный чат'
    },
    {
      icon: '🔄',
      title: 'Гарантия возврата',
      description: 'Вернём деньги, если работа не выполнена качественно'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Найдите идеального исполнителя
              <span className="block text-slate-400">
                для вашего проекта
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
              Платформа, которая соединяет заказчиков с профессиональными исполнителями 
              со всего мира. От дизайна до разработки — всё в одном месте.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/services"
                className="w-full sm:w-auto px-8 py-4 bg-slate-700 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-600 transition-all duration-200"
              >
                Найти услугу
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-200"
              >
                Стать исполнителем
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Бесплатная регистрация</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Без комиссии для заказчиков</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Гарантия качества</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Популярные категории</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Выберите категорию, которая подходит для вашего проекта
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="group p-6 bg-slate-800/30 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-white font-medium mb-1">{category.name}</h3>
                <p className="text-slate-400 text-sm">{category.subcategories.length} подкатегорий</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/categories"
              className="inline-flex items-center text-slate-400 hover:text-slate-300 font-medium transition-colors"
            >
              Смотреть все категории
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Рекомендуемые услуги</h2>
              <p className="text-slate-400">Лучшие исполнители платформы</p>
            </div>
            <Link
              to="/services"
              className="hidden sm:inline-flex items-center text-slate-400 hover:text-slate-300 font-medium transition-colors"
            >
              Все услуги
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/service/${service.id}`)}
                className="group bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video bg-slate-700/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {categories.find(c => c.id === service.category)?.icon || '📦'}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-slate-300 transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {service.sellerName.charAt(0)}
                    </div>
                    <span className="text-slate-400 text-sm">{service.sellerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      {service.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-slate-400 text-sm">
                      {service.deliveryTime} дн.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/services"
              className="inline-flex items-center text-slate-400 hover:text-slate-300 font-medium transition-colors"
            >
              Все услуги
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Почему выбирают нас</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Мы создали платформу, которая удобна и безопасна для всех участников
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-800 rounded-3xl p-8 lg:p-12 overflow-hidden border border-slate-700">
            <div className="relative text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Готовы начать?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Присоединяйтесь к тысячам пользователей, которые уже нашли своих идеальных исполнителей 
                или получили новые заказы на нашей платформе.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-700 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-600 transition-all duration-200"
                >
                  Создать аккаунт
                </Link>
                <Link
                  to="/services"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-200"
                >
                  Browse Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
