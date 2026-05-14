import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Services: React.FC = () => {
  const { services, categories } = useServices();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price_low' | 'price_high' | 'newest'>('popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const filteredServices = useMemo(() => {
    let result = services.filter(s => s.isActive);

    if (selectedCategory) {
      result = result.filter(s => s.category === selectedCategory);
    }

    if (selectedSubcategory) {
      result = result.filter(s => s.subcategory === selectedSubcategory);
    }

    result = result.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default:
        result.sort((a, b) => b.ordersCount - a.ordersCount);
    }

    return result;
  }, [services, selectedCategory, selectedSubcategory, priceRange, sortBy, searchQuery]);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via filteredServices
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {selectedCategoryData ? selectedCategoryData.name : 'Все услуги'}
          </h1>
          <p className="text-gray-400">
            {filteredServices.length} {filteredServices.length === 1 ? 'услуга' : filteredServices.length < 5 ? 'услуги' : 'услуг'} найдено
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* Categories */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Категории</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Все категории
                </button>
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => { setSelectedCategory(category.id); setSelectedSubcategory(''); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === category.id ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </span>
                    </button>
                    {selectedCategory === category.id && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubcategory(sub)}
                            className={`block w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                              selectedSubcategory === sub ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Цена</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="От"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="До"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{priceRange[0].toLocaleString()} ₽</span>
                  <span>{priceRange[1].toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
                setPriceRange([0, 100000]);
                setSearchQuery('');
                setSortBy('popular');
              }}
              className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded-xl text-gray-300 hover:bg-white/10 transition-colors text-sm"
            >
              Сбросить фильтры
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort & View */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Сортировать:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="popular">Популярные</option>
                  <option value="rating">По рейтингу</option>
                  <option value="price_low">Цена: низкая</option>
                  <option value="price_high">Цена: высокая</option>
                  <option value="newest">Новые</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {categories.find(c => c.id === service.category)?.icon || '📦'}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white text-sm font-medium">{service.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {service.title}
                      </h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {service.sellerName.charAt(0)}
                        </div>
                        <span className="text-gray-400 text-sm">{service.sellerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">
                          {service.price.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="text-gray-400 text-sm">
                          {service.deliveryTime} дн.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h3>
                <p className="text-gray-400 mb-6">Попробуйте изменить параметры поиска</p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubcategory('');
                    setPriceRange([0, 100000]);
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
