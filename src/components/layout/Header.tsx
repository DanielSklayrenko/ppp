import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/ServicesContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getUnreadCount } = useServices();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">ServiceHub</span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск услуг..."
                className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
              Услуги
            </Link>
            <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">
              Категории
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="text-gray-300 hover:text-white transition-colors relative">
                  Сообщения
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Заказы
                </Link>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                          user?.role === 'executor' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user?.role === 'executor' ? 'Исполнитель' : 'Заказчик'}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Профиль
                        </Link>
                        {user?.role === 'executor' && (
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Панель исполнителя
                          </Link>
                        )}
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Настройки
                        </Link>
                        <hr className="my-2 border-white/10" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/create-service"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Создать услугу
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск услуг..."
                  className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            <nav className="space-y-2">
              <Link to="/services" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                Услуги
              </Link>
              <Link to="/categories" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                Категории
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/messages" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                    Сообщения ({unreadCount})
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                    Заказы
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                    Профиль
                  </Link>
                  {user?.role === 'executor' && (
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                      Панель исполнителя
                    </Link>
                  )}
                  <Link to="/create-service" className="block px-4 py-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
                    Создать услугу
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                    Войти
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
