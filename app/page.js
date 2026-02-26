'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, PlusCircle, MapPin, X, Moon, Sun, ShoppingBag } from 'lucide-react';

export default function Page() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');

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
      console.error('Error loading products:', error.message);
    }
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ყველა ველი!");
    try {
      const { error } = await supabase
        .from('products')
        .insert([{ 
          title: tempTitle, 
          price: parseFloat(tempPrice), 
          category: selectedCategory === 'ყველა' ? 'სხვა' : selectedCategory,
          location: 'თბილისი',
          image: '📦' 
        }]);
      if (error) throw error;
      setIsModalOpen(false);
      setTempTitle('');
      setTempPrice('');
      fetchProducts();
    } catch (error) {
      alert("შეცდომა: " + error.message);
    }
  };

  const filtered = products.filter(p => 
    (selectedCategory === 'ყველა' || p.category === selectedCategory) &&
    (p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-sans">
        
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400">
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
                <h3 className="font-bold text-lg mb-1 truncate">{p.title}</h3>
                <div className="text-blue-600 font-black text-2xl mb-2">{p.price} ₾</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <MapPin size={12} /> {p.location}
                </div>
              </div>
            ))}
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl border dark:border-slate-700">
              <button
