import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">ServiceHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Платформа для поиска и предоставления профессиональных услуг. 
              Соединяем заказчиков с лучшими исполнителями.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-1.334-.024-.024.051-.272.051-.272.995-.45 1.641-.45 1.641-.45.092.092.092.275.092.275.927 1.588 2.432 1.129 3.021.86.092-.671.362-1.126.658-1.382-2.327-.264-4.771-1.164-4.771-1.164-.024-.024.051-.272.051-.272.995-.45 1.641-.45 1.641-.45.092.092.092.275.092.275.927 1.588 2.432 1.129 3.021.86.092-.671.362-1.126.658-1.382-2.327-.264-4.771-1.164-4.771-1.164z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li><Link to="/services?category=design" className="text-gray-400 hover:text-white text-sm transition-colors">Дизайн</Link></li>
              <li><Link to="/services?category=development" className="text-gray-400 hover:text-white text-sm transition-colors">Разработка</Link></li>
              <li><Link to="/services?category=marketing" className="text-gray-400 hover:text-white text-sm transition-colors">Маркетинг</Link></li>
              <li><Link to="/services?category=writing" className="text-gray-400 hover:text-white text-sm transition-colors">Тексты</Link></li>
              <li><Link to="/services?category=video" className="text-gray-400 hover:text-white text-sm transition-colors">Видео</Link></li>
              <li><Link to="/services?category=music" className="text-gray-400 hover:text-white text-sm transition-colors">Аудио</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">О нас</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white text-sm transition-colors">Карьера</Link></li>
              <li><Link to="/press" className="text-gray-400 hover:text-white text-sm transition-colors">Пресса</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Блог</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-400 hover:text-white text-sm transition-colors">Помощь</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Условия</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Конфиденциальность</Link></li>
              <li><Link to="/safety" className="text-gray-400 hover:text-white text-sm transition-colors">Безопасность</Link></li>
              <li><Link to="/disputes" className="text-gray-400 hover:text-white text-sm transition-colors">Споры</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2026 ServiceHub. Все права защищены.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Принимаем:</span>
              <div className="flex space-x-3">
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">VISA</span>
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">MC</span>
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">МИР</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
