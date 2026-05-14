import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ServicesProvider } from './context/ServicesContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Categories from './pages/Categories';
import CreateService from './pages/CreateService';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ServicesProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/categories" element={<Categories />} />

            {/* Protected Routes */}
            <Route path="/create-service" element={
              <ProtectedRoute requireExecutor>
                <CreateService />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/messages/:orderId" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requireExecutor>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Placeholder Pages */}
            <Route path="/about" element={<PlaceholderPage title="О нас" emoji="🏢" />} />
            <Route path="/careers" element={<PlaceholderPage title="Карьера" emoji="💼" />} />
            <Route path="/press" element={<PlaceholderPage title="Пресса" emoji="📰" />} />
            <Route path="/blog" element={<PlaceholderPage title="Блог" emoji="📝" />} />
            <Route path="/contact" element={<PlaceholderPage title="Контакты" emoji="📧" />} />
            <Route path="/help" element={<PlaceholderPage title="Помощь" emoji="❓" />} />
            <Route path="/terms" element={<PlaceholderPage title="Условия использования" emoji="📄" />} />
            <Route path="/privacy" element={<PlaceholderPage title="Политика конфиденциальности" emoji="🔒" />} />
            <Route path="/safety" element={<PlaceholderPage title="Безопасность" emoji="🛡️" />} />
            <Route path="/disputes" element={<PlaceholderPage title="Разрешение споров" emoji="⚖️" />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ServicesProvider>
      </AuthProvider>
    </Router>
  );
};

const PlaceholderPage: React.FC<{ title: string; emoji: string }> = ({ title, emoji }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="text-8xl mb-6">{emoji}</div>
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <p className="text-gray-400 mb-8">Эта страница находится в разработке</p>
      <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        На главную
      </a>
    </div>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="text-8xl mb-6">404</div>
      <h1 className="text-3xl font-bold text-white mb-4">Страница не найдена</h1>
      <p className="text-gray-400 mb-8">Запрашиваемая страница не существует</p>
      <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        На главную
      </a>
    </div>
  </div>
);

export default App;
