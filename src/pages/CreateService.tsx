import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CreateService: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addService, categories } = useServices();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    deliveryTime: '3',
    tags: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || user?.role !== 'executor') {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Доступ ограничен</h1>
          <p className="text-gray-400 mb-6">
            Только исполнители могут создавать услуги
          </p>
          {!isAuthenticated ? (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Войти
            </button>
          ) : (
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Обновить профиль
            </button>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  const selectedCategory = categories.find(c => c.id === formData.category);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Введите название услуги';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Название должно содержать минимум 10 символов';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Введите описание';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Описание должно содержать минимум 50 символов';
    }
    
    if (!formData.price || Number(formData.price) < 100) {
      newErrors.price = 'Минимальная цена 100 ₽';
    }
    
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }
    
    if (!formData.deliveryTime || Number(formData.deliveryTime) < 1) {
      newErrors.deliveryTime = 'Минимальный срок 1 день';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    const newService = addService({
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      deliveryTime: Number(formData.deliveryTime),
      images: [],
      sellerId: user!.id,
      sellerName: user!.name,
      sellerAvatar: user!.avatar,
      sellerRating: user!.rating,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      isActive: true
    });

    setIsSubmitting(false);
    navigate(`/service/${newService.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Создать новую услугу</h1>
          <p className="text-gray-400">
            Заполните форму, чтобы добавить вашу услугу на платформу
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Основная информация</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Название услуги *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.title ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Например: Разработка лендинга на React"
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Описание *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.description ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Подробно опишите, что входит в услугу, какие технологии используете, какой результат получит заказчик..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                <p className="mt-1 text-sm text-gray-400">
                  Минимум 50 символов. Сейчас: {formData.description.length}
                </p>
              </div>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Категория и цена</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Категория *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.category ? 'border-red-500' : 'border-white/20'
                  }`}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
              </div>

              {selectedCategory && (
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-300 mb-2">
                    Подкатегория
                  </label>
                  <select
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите подкатегорию</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.price ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="5000"
                  min="100"
                />
                {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-300 mb-2">
                  Срок выполнения (дней) *
                </label>
                <input
                  type="number"
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.deliveryTime ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="3"
                  min="1"
                />
                {errors.deliveryTime && <p className="mt-1 text-sm text-red-400">{errors.deliveryTime}</p>}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Теги</h2>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                Ключевые слова
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="react, frontend, landing (через запятую)"
              />
              <p className="mt-2 text-sm text-gray-400">
                Введите теги через запятую для лучшего поиска
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Публикация...' : 'Опубликовать услугу'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CreateService;
