import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  deliveryTime: number; // days
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerRating: number;
  rating: number;
  reviewsCount: number;
  ordersCount: number;
  tags: string[];
  createdAt: Date;
  isActive: boolean;
}

export interface Review {
  id: string;
  serviceId: string;
  orderId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage?: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  requirements: string;
  deliveryDate: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  deliveredFiles?: string[];
  message: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
  isRead: boolean;
}

interface ServicesContextType {
  services: Service[];
  reviews: Review[];
  orders: Order[];
  messages: Message[];
  categories: Category[];
  addService: (service: Omit<Service, 'id' | 'rating' | 'reviewsCount' | 'ordersCount' | 'createdAt'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Review;
  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => Message;
  markMessagesRead: (orderId: string, userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getServiceById: (id: string) => Service | undefined;
  getOrdersByUser: (userId: string, role: 'buyer' | 'seller') => Order[];
  getMessagesByOrder: (orderId: string) => Message[];
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

const SERVICES_KEY = 'service_platform_services';
const REVIEWS_KEY = 'service_platform_reviews';
const ORDERS_KEY = 'service_platform_orders';
const MESSAGES_KEY = 'service_platform_messages';

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

const defaultCategories: Category[] = [
  {
    id: 'design',
    name: 'Дизайн',
    icon: '🎨',
    subcategories: ['Логотипы', 'Веб-дизайн', 'Графический дизайн', 'UI/UX', 'Иллюстрации']
  },
  {
    id: 'development',
    name: 'Разработка',
    icon: '💻',
    subcategories: ['Веб-сайты', 'Мобильные приложения', 'Backend', 'Frontend', 'WordPress']
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    icon: '📈',
    subcategories: ['SEO', 'SMM', 'Контекстная реклама', 'Email-маркетинг', 'Аналитика']
  },
  {
    id: 'writing',
    name: 'Тексты',
    icon: '✍️',
    subcategories: ['Копирайтинг', 'Переводы', 'Редактирование', 'Технические тексты', 'Сценарии']
  },
  {
    id: 'video',
    name: 'Видео',
    icon: '🎬',
    subcategories: ['Монтаж', 'Анимация', 'Рекламные ролики', 'Обучающие видео', 'Motion design']
  },
  {
    id: 'music',
    name: 'Аудио',
    icon: '🎵',
    subcategories: ['Озвучка', 'Музыка', 'Подкасты', 'Саунд-дизайн', 'Сведение']
  },
  {
    id: 'business',
    name: 'Бизнес',
    icon: '💼',
    subcategories: ['Консультации', 'Презентации', 'Исследования', 'Финансы', 'HR']
  },
  {
    id: 'lifestyle',
    name: 'Лайфстайл',
    icon: '🌟',
    subcategories: ['Гадания', 'Фитнес', 'Питание', 'Путешествия', 'Хобби']
  }
];

const sampleServices: Omit<Service, 'id' | 'createdAt'>[] = [
  {
    title: 'Разработка современного веб-сайта под ключ',
    description: 'Создам профессиональный веб-сайт для вашего бизнеса. Включает адаптивный дизайн, SEO-оптимизацию, интеграцию с CMS. Использую современные технологии: React, Node.js, PostgreSQL.',
    price: 25000,
    category: 'development',
    subcategory: 'Веб-сайты',
    deliveryTime: 14,
    images: ['/images/services/web-dev.jpg'],
    sellerId: 'sample1',
    sellerName: 'Александр Петров',
    sellerAvatar: '/images/avatars/avatar1.jpg',
    sellerRating: 4.9,
    rating: 4.9,
    reviewsCount: 127,
    ordersCount: 89,
    tags: ['react', 'nodejs', 'responsive', 'seo'],
    isActive: true
  },
  {
    title: 'Дизайн логотипа и фирменного стиля',
    description: 'Разработаю уникальный логотип и полный фирменный стиль для вашего бренда. Включает несколько концепций, правки, исходные файлы в векторе.',
    price: 8000,
    category: 'design',
    subcategory: 'Логотипы',
    deliveryTime: 5,
    images: ['/images/services/logo-design.jpg'],
    sellerId: 'sample2',
    sellerName: 'Мария Иванова',
    sellerAvatar: '/images/avatars/avatar2.jpg',
    sellerRating: 5.0,
    rating: 4.8,
    reviewsCount: 203,
    ordersCount: 156,
    tags: ['logo', 'branding', 'identity', 'vector'],
    isActive: true
  },
  {
    title: 'Настройка контекстной рекламы Яндекс.Директ',
    description: 'Профессиональная настройка рекламных кампаний. Анализ конкурентов, подбор ключевых слов, создание объявлений, настройка аналитики.',
    price: 15000,
    category: 'marketing',
    subcategory: 'Контекстная реклама',
    deliveryTime: 7,
    images: ['/images/services/ads.jpg'],
    sellerId: 'sample3',
    sellerName: 'Дмитрий Козлов',
    sellerAvatar: '/images/avatars/avatar3.jpg',
    sellerRating: 4.7,
    rating: 4.7,
    reviewsCount: 84,
    ordersCount: 62,
    tags: ['yandex', 'ads', 'marketing', 'roi'],
    isActive: true
  },
  {
    title: 'Написание SEO-статей для сайта',
    description: 'Создам уникальные, оптимизированные статьи для вашего сайта. Глубокая проработка темы, проверка на уникальность, подбор ключевых слов.',
    price: 2500,
    category: 'writing',
    subcategory: 'Копирайтинг',
    deliveryTime: 3,
    images: ['/images/services/copywriting.jpg'],
    sellerId: 'sample4',
    sellerName: 'Елена Смирнова',
    sellerAvatar: '/images/avatars/avatar4.jpg',
    sellerRating: 4.9,
    rating: 4.9,
    reviewsCount: 312,
    ordersCount: 278,
    tags: ['seo', 'copywriting', 'content', 'articles'],
    isActive: true
  },
  {
    title: 'Монтаж видео для YouTube и соцсетей',
    description: 'Профессиональный видеомонтаж любой сложности. Цветокоррекция, саунд-дизайн, графика, анимация. Работаю с форматами для всех платформ.',
    price: 5000,
    category: 'video',
    subcategory: 'Монтаж',
    deliveryTime: 4,
    images: ['/images/services/video-edit.jpg'],
    sellerId: 'sample5',
    sellerName: 'Игорь Волков',
    sellerAvatar: '/images/avatars/avatar5.jpg',
    sellerRating: 4.8,
    rating: 4.8,
    reviewsCount: 156,
    ordersCount: 134,
    tags: ['video', 'editing', 'youtube', 'social'],
    isActive: true
  },
  {
    title: 'Озвучка рекламных роликов и подкастов',
    description: 'Профессиональная озвучка вашим проектам. Мужской/женский голос, разные стили подачи. Студийное качество записи.',
    price: 3000,
    category: 'music',
    subcategory: 'Озвучка',
    deliveryTime: 2,
    images: ['/images/services/voiceover.jpg'],
    sellerId: 'sample6',
    sellerName: 'Анна Новикова',
    sellerAvatar: '/images/avatars/avatar6.jpg',
    sellerRating: 5.0,
    rating: 5.0,
    reviewsCount: 89,
    ordersCount: 76,
    tags: ['voiceover', 'audio', 'podcast', 'advertising'],
    isActive: true
  }
];

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const parseDates = (obj: any, dateFields: string[]): any => {
  const result = { ...obj };
  dateFields.forEach(field => {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  });
  return result;
};

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [categories] = useState<Category[]>(defaultCategories);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const storedServices = loadFromStorage<Service[]>(SERVICES_KEY, []);
      const storedReviews = loadFromStorage<Review[]>(REVIEWS_KEY, []);
      const storedOrders = loadFromStorage<Order[]>(ORDERS_KEY, []);
      const storedMessages = loadFromStorage<Message[]>(MESSAGES_KEY, []);

      if (storedServices.length === 0) {
        const initializedServices = sampleServices.map(s => ({
          ...s,
          id: crypto.randomUUID(),
          createdAt: new Date()
        }));
        setServices(initializedServices);
        saveToStorage(SERVICES_KEY, initializedServices);
      } else {
        setServices(storedServices.map(s => parseDates(s, ['createdAt'])));
      }

      setReviews(storedReviews.map(r => parseDates(r, ['createdAt'])));
      setOrders(storedOrders.map(o => parseDates(o, ['createdAt', 'deliveryDate', 'deliveredAt', 'completedAt'])));
      setMessages(storedMessages.map(m => parseDates(m, ['createdAt'])));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToStorage(SERVICES_KEY, services);
    }
  }, [services, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToStorage(REVIEWS_KEY, reviews);
    }
  }, [reviews, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToStorage(ORDERS_KEY, orders);
    }
  }, [orders, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToStorage(MESSAGES_KEY, messages);
    }
  }, [messages, isInitialized]);

  const addService = (serviceData: Omit<Service, 'id' | 'rating' | 'reviewsCount' | 'ordersCount' | 'createdAt'>): Service => {
    const newService: Service = {
      ...serviceData,
      id: crypto.randomUUID(),
      rating: 0,
      reviewsCount: 0,
      ordersCount: 0,
      createdAt: new Date()
    };
    setServices(prev => [newService, ...prev]);
    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>): Review => {
    const newReview: Review = {
      ...reviewData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setReviews(prev => [...prev, newReview]);

    // Update service rating
    setServices(prev => prev.map(s => {
      if (s.id === reviewData.serviceId) {
        const newReviewsCount = s.reviewsCount + 1;
        const newRating = ((s.rating * s.reviewsCount) + reviewData.rating) / newReviewsCount;
        return { ...s, reviewsCount: newReviewsCount, rating: Math.round(newRating * 10) / 10 };
      }
      return s;
    }));

    return newReview;
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);

    // Update service orders count
    setServices(prev => prev.map(s => 
      s.id === orderData.serviceId ? { ...s, ordersCount: s.ordersCount + 1 } : s
    ));

    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message => {
    const newMessage: Message = {
      ...messageData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const markMessagesRead = (orderId: string, userId: string) => {
    setMessages(prev => prev.map(m => 
      m.orderId === orderId && m.senderId !== userId ? { ...m, isRead: true } : m
    ));
  };

  const getUnreadCount = (userId: string): number => {
    return messages.filter(m => !m.isRead && m.senderId !== userId).length;
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.find(s => s.id === id);
  };

  const getOrdersByUser = (userId: string, role: 'buyer' | 'seller'): Order[] => {
    return orders.filter(o => role === 'buyer' ? o.buyerId === userId : o.sellerId === userId);
  };

  const getMessagesByOrder = (orderId: string): Message[] => {
    return messages.filter(m => m.orderId === orderId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  return (
    <ServicesContext.Provider value={{
      services,
      reviews,
      orders,
      messages,
      categories,
      addService,
      updateService,
      deleteService,
      addReview,
      createOrder,
      updateOrder,
      addMessage,
      markMessagesRead,
      getUnreadCount,
      getServiceById,
      getOrdersByUser,
      getMessagesByOrder
    }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
