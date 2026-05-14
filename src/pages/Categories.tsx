import React from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Categories: React.FC = () => {
  const { categories, services } = useServices();

  const getCategoryStats = (categoryId: string) => {
    const categoryServices = services.filter(s => s.category === categoryId && s.isActive);
    return {
      servicesCount: categoryServices.length,
      avgPrice: categoryServices.length > 0 
        ? Math.round(categoryServices.reduce((sum, s) => sum + s.price, 0) / categoryServices.length)
        : 0
    };
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Все категории</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Выберите категорию, чтобы найти подходящего исполнителя для вашего проекта
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            return (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{category.name}</h2>
                <p className="text-gray-400 text-sm mb-4">
                  {category.subcategories.length} подкатегорий
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-purple-400 text-sm">
                    {stats.servicesCount} {stats.servicesCount === 1 ? 'услуга' : stats.servicesCount < 5 ? 'услуги' : 'услуг'}
                  </span>
                  {stats.avgPrice > 0 && (
                    <span className="text-gray-500 text-xs">
                      от {stats.avgPrice.toLocaleString()} ₽
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {category.subcategories.slice(0, 3).map((sub, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                      +{category.subcategories.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Не нашли нужную категорию?
          </h2>
          <p className="text-gray-400 mb-6">
            Наши исполнители работают во многих смежных областях
          </p>
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Смотреть все услуги
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
