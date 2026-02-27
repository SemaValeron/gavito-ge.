'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [tempCat, setTempCat] = useState('tech');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Обновленные категории с градиентами и иконками
  const CATEGORIES = [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500' },
    { id: 'realestate', name: 'უძრავი ქონება', img: '🏠', color: 'from-emerald-400 to-teal-600' },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600' },
    { id: 'home', name: 'სახლი და ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500' },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500' },
    { id: 'beauty', name: 'მოვლა და პარფიუმი', img: '💄', color: 'from-rose-400 to-fuchsia-500' },
    { id: 'sport', name: 'სპორტი', img: '⚽', color: 'from-green-400 to-emerald-500' },
    { id: 'kids', name: 'ბავშვებისთვის', img: '🧸', color: 'from-cyan-400 to-blue-500' },
  ];

  const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი', 'მცხეთა'];

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    await supabase.from('products').insert([{ 
      title: tempTitle, 
      price: parseFloat(tempPrice), 
      location: tempLocation, 
      category: tempCat, 
      image: 'https://via.placeholder.com/400'
    }]);
    setIsModalOpen(false);
    setTempTitle(''); setTempPrice('');
    fetchProducts();
  };

  const filtered = products.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ყველა ქალაქი' || p.location === selectedCity;
    return matchesSearch && matchesCat && matchesCity;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* Header */}
      <header className="bg-white dark:bg-[#1e293b] border-b dark:border-slate-800 p-4 sticky top-0 z-50 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter cursor-pointer" onClick={() => setSelectedCategory('all')}>GAVITO</div>
          <div className="flex-1 flex gap-2 w-full">
            <input 
              type="text" placeholder="მოძებნეთ ყველაფერი..." 
              className="flex-[2] p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 dark:text-white transition-all text-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold cursor-pointer dark:text-white transition-all text-sm"
              value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xl hover:rotate-12 transition-transform">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">განცხადება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Category Grid (Как на Авито) */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-6 opacity-80 uppercase tracking-widest text-sm">კატეგორიები</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative flex flex-col items-center p-4 rounded-[2rem] transition-all duration-300 ${
                  selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-xl scale-105' 
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <div className={`w-12 h-12 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                  {cat.img}
                </div>
                <span className="text-[11px] font-bold text-center leading-tight uppercase tracking-tighter">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <h2 className="text-xl font-black mb-6 opacity-80 uppercase tracking-widest text-sm">განცხადებები</h2>
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="group bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="relative overflow-hidden w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-[1.8rem] mb-4 flex items-center justify-center text-5xl">
                📦
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black">{p.location}</div>
              </div>
              <h3 className="font-bold text-lg mb-1 dark:text-white truncate">{p.title}</h3>
              <div className="flex items-center justify-between mt-4">
                <div className="text-blue-600 dark:text-blue-400 font-black text-2xl">{p.price} ₾</div>
                <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">💙</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-black dark:hover:text-white transition-colors">✕</button>
            <h2 className="text-3xl font-black mb-8 tracking-tighter dark:text-white uppercase">დამატება</h2>
            
            <div className="space-y-4">
              <input type="text" placeholder="რას ყიდით?" className="w-full p-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-4 ring-blue-500/10 transition-all" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              <div className="grid grid-cols-2 gap-3">
                <select className="p-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none appearance-none font-bold" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="p-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none appearance-none font-bold" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                  {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <input type="number" placeholder="ფასი (₾)" className="w-full p-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-4 ring-blue-500/10 transition-all font-bold" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />

              <button onClick={handlePublish} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
