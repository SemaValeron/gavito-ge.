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
          <div className="
