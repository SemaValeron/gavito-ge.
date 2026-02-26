'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Проверь, что этот файл создан в папке lib
import { Search, PlusCircle, MapPin, X, Moon, Sun, ShoppingBag } from 'lucide-react';

export default function Page() {
  // --- СОСТОЯНИЯ (STATES) ---
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Поля для нового товара
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');

  // --- ЗАГРУЗКА ДАННЫХ ---
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error.message);
    }
  }

  // --- ФУНКЦИЯ ДОБАВЛЕНИЯ ТОВАРА ---
  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) {
      alert("გთხოვთ შეავსოთ ყველა ველი!");
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          { 
            title: tempTitle, 
            price: parseFloat(tempPrice), 
            category: selectedCategory === 'ყველა' ? 'სხვა' : selectedCategory,
            location: 'თბილისი', // Можно добавить выбор города позже
            image: '📦' 
          }
        ]);

      if (error) throw error;
      
      // Если успешно:
      setIsModalOpen(false);
      setTempTitle('');
      setTempPrice('');
      fetchProducts(); // Обновляем список, чтобы увидеть новый товар
    } catch (error) {
      alert("შეცდომა: " + error.message);
    }
  };

  // --- ФИЛЬТРАЦИЯ (Исправлено: используем products) ---
  const filtered = products.filter(p => 
    (selectedCategory === 'ყველა' || p.category === selectedCategory) &&
    (p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-sans">
        
        {/* HEADER */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="text-2xl font-black text-blue-600 flex items-center gap-2">
              <ShoppingBag /> GAVITO
            </div>
            
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="ძებნა..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95"
              >
                <PlusCircle size={20}/> დამატება
              </button>
            </div>
          </div>
        </header>

