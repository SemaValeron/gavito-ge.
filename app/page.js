'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, PlusCircle, MapPin, Sparkles, X, Heart, Moon, Sun, ChevronDown } from 'lucide-react';

export default function Page() {
  // 1. Состояния
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedCity, setSelectedCity] = useState('ყველა საქართველო');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');

  // 2. Загрузка данных из Supabase
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
      console.error('Ошибка загрузки:', error.message);
    }
  }

  // 3. Функция публикации
  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ყველა ველი!");

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          { 
            title: tempTitle, 
            price: parseFloat(tempPrice), 
            category: selectedCategory === 'ყველა' ? 'სხვა' : selectedCategory,
            location: selectedCity,
            image: '📦' 
          }
        ]);

      if (error) throw error;
      
      setIsModalOpen(false);
      setTempTitle('');
      setTempPrice('');
      fetchProducts(); // Обновляем список
    } catch (error) {
      alert("Ошибка при сохранении: " + error.message);
    }
  };

  // 4. Фильтрация (ИСПРАВЛЕНО: используем products вместо allProducts)
  const filtered = products.filter(p => 
    (selectedCategory === 'ყველა' || p.category === selectedCategory) &&
    (selectedCity === 'ყველა საქართველო' || p.location === selectedCity) &&
    (p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-sans">
        
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="text-2xl font-black text-blue-600">GAVITO</div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-yellow-400">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2">
                <PlusCircle size={20}/> დამატება
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
                <div className="aspect-square mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-[2rem] text-6xl">
                  {p.image || '📦'}
                </div>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <div className="text-blue-600 dark:text-blue-400 font-black text-2xl">{p.price} ₾</div>
                <div className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-wider">{p.location}</div>
              </div>
            ))}
          </div>
          
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-bold text-xl">
              განცხადებები ვერ მოიძებნა...
            </div>
          )}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400"><X size={24}/></button>
              <h2 className="text-2xl font-black mb-6">დამატება</h2>
              <div className="space-y-4">
                <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" onChange={(e) => setTempTitle(e.target.value)} />
                <input type="number" placeholder="ფასი" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" onChange={(e) => setTempPrice(e.target.value)} />
                <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
                  გამოქვეყნება
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
