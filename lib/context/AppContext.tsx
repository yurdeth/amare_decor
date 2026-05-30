'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Mesas' | 'Sillas' | 'Decoración' | 'Iluminación' | 'Textiles' | 'Otros';
  quantity: number;
  status: 'available' | 'in-use' | 'maintenance';
  estimatedValue: number;
  description?: string;
  createdAt: string;
}

export interface EventItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface Event {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  type: 'Boda' | 'Cumpleaños' | 'Corporativo' | 'Aniversario' | 'Otros';
  budget: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  items: EventItem[];
  notes?: string;
  createdAt: string;
}

export interface Income {
  id: string;
  eventId: string;
  eventName: string;
  amount: number;
  date: string;
  category: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: 'Materiales' | 'Mano de obra' | 'Transporte' | 'Alquiler' | 'Otros';
  description: string;
}

interface AppContextType {
  // Data
  clients: Client[];
  products: Product[];
  events: Event[];
  incomes: Income[];
  expenses: Expense[];

  // Clients
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, quantity: number) => void;
  updateProductStatus: (id: string, status: Product['status']) => void;
  getLowStockProducts: (threshold?: number) => Product[];
  getProductsByCategory: (category: Product['category']) => Product[];
  getProductsByStatus: (status: Product['status']) => Product[];

  // Events
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getUpcomingEvents: (limit?: number) => Event[];
  getEventsByClient: (clientId: string) => Event[];
  calculateEventProfit: (eventId: string) => number;

  // Finances
  addIncome: (income: Omit<Income, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  getTotalIncome: (startDate?: string, endDate?: string) => number;
  getTotalExpenses: (startDate?: string, endDate?: string) => number;
  getNetProfit: (startDate?: string, endDate?: string) => number;

  // Dashboard Metrics
  getDashboardMetrics: () => {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    activeEvents: number;
  };
  getTopProducts: (limit?: number) => { product: string; count: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load data from localStorage on mount (single optimized useEffect)
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedClients = localStorage.getItem('amere-clients');
        const storedProducts = localStorage.getItem('amere-products');
        const storedEvents = localStorage.getItem('amere-events');
        const storedIncomes = localStorage.getItem('amere-incomes');
        const storedExpenses = localStorage.getItem('amere-expenses');

        if (storedClients) setClients(JSON.parse(storedClients));
        if (storedProducts) setProducts(JSON.parse(storedProducts));
        if (storedEvents) setEvents(JSON.parse(storedEvents));
        if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Handle localStorage full or disabled
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. Please clear some data.');
        }
      }
    };

    loadFromLocalStorage();
  }, []);

  // Save all data to localStorage whenever any state changes (consolidated useEffect)
  useEffect(() => {
    const saveAllToLocalStorage = () => {
      try {
        localStorage.setItem('amere-clients', JSON.stringify(clients));
        localStorage.setItem('amere-products', JSON.stringify(products));
        localStorage.setItem('amere-events', JSON.stringify(events));
        localStorage.setItem('amere-incomes', JSON.stringify(incomes));
        localStorage.setItem('amere-expenses', JSON.stringify(expenses));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. Unable to save some data.');
        }
      }
    };

    // Debounce save operations to avoid excessive writes
    const timeoutId = setTimeout(saveAllToLocalStorage, 100);
    return () => clearTimeout(timeoutId);
  }, [clients, products, events, incomes, expenses]);

  // Helper function to generate IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Clients
  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(clients.map(client => (client.id === id ? { ...client, ...data } : client)));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const getClientById = (id: string) => clients.find(client => client.id === id);

  // Products
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(products.map(product => (product.id === id ? { ...product, ...data } : product)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const updateProductStock = (id: string, quantity: number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity } : product
    ));
  };

  const updateProductStatus = (id: string, status: Product['status']) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, status } : product
    ));
  };

  const getLowStockProducts = (threshold: number = 5) => {
    return products.filter(product => product.quantity < threshold);
  };

  const getProductsByCategory = (category: Product['category']) => {
    return products.filter(product => product.category === category);
  };

  const getProductsByStatus = (status: Product['status']) => {
    return products.filter(product => product.status === status);
  };

  // Events
  const addEvent = (event: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...event,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, data: Partial<Event>) => {
    setEvents(events.map(event => (event.id === id ? { ...event, ...data } : event)));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getUpcomingEvents = (limit: number = 5) => {
    const now = new Date();
    return events
      .filter(event => new Date(event.date) >= now && event.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  };

  const getEventsByClient = (clientId: string) => {
    return events.filter(event => event.clientId === clientId);
  };

  const calculateEventProfit = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return 0;

    const eventIncome = incomes
      .filter(income => income.eventId === eventId)
      .reduce((sum, income) => sum + income.amount, 0);

    return eventIncome - event.budget;
  };

  // Finances
  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...income,
      id: generateId(),
    };
    setIncomes([...incomes, newIncome]);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const getTotalIncome = (startDate?: string, endDate?: string) => {
    let filtered = incomes;
    if (startDate) {
      filtered = filtered.filter(income => new Date(income.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(income => new Date(income.date) <= new Date(endDate));
    }
    return filtered.reduce((sum, income) => sum + income.amount, 0);
  };

  const getTotalExpenses = (startDate?: string, endDate?: string) => {
    let filtered = expenses;
    if (startDate) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(endDate));
    }
    return filtered.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getNetProfit = (startDate?: string, endDate?: string) => {
    return getTotalIncome(startDate, endDate) - getTotalExpenses(startDate, endDate);
  };

  // Dashboard Metrics (memoized in components, here just the logic)
  const getDashboardMetrics = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    return {
      totalIncome: getTotalIncome(startOfMonth),
      totalExpenses: getTotalExpenses(startOfMonth),
      netProfit: getNetProfit(startOfMonth),
      activeEvents: events.filter(e =>
        e.status === 'pending' || e.status === 'confirmed'
      ).length,
    };
  };

  const getTopProducts = (limit: number = 5) => {
    const productCounts: { [key: string]: number } = {};

    events.forEach(event => {
      event.items.forEach(item => {
        productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
      });
    });

    return Object.entries(productCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  // Memoize expensive calculations
  const memoizedMetrics = React.useMemo(() => getDashboardMetrics(), [events, incomes, expenses]);
  const memoizedTopProducts = React.useMemo(() => getTopProducts(), [events]);

  const value: AppContextType = {
    clients,
    products,
    events,
    incomes,
    expenses,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    updateProductStatus,
    getLowStockProducts,
    getProductsByCategory,
    getProductsByStatus,
    addEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsByClient,
    calculateEventProfit,
    addIncome,
    addExpense,
    getTotalIncome,
    getTotalExpenses,
    getNetProfit,
    getDashboardMetrics,
    getTopProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
