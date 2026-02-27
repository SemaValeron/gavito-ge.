'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояния формы
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Рефы для скролла
  const scrollRef = useRef(null);

  const ADS = [
    { text: "GAVITO — შენი საიმედო მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "ენდე ჩვენს AI შემფასებელს", img: "🤖", color: "from-purple-600 to-pink-600" },
  ];

  const CATEGORIES = [
    { id: 'all', name: 'ყველა', img: '✨' },
    { id: 'cars', name: 'ავტო', img: '🚗' },
    { id: 'realestate', name: 'უძრავი ქონება', img: '🏠' },
    { id: 'tech', name: 'ტექნიკა', img: '📱' },
    { id: 'home', name: 'სახლი და ბაღი', img: '🌿' },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕' },
    { id: 'beauty', name: 'მოვლა და პარფიუმი', img: '💄' },
    { id: 'sport', name: 'სპორტი', img: '⚽' },
    { id: 'kids', name: 'ბავშვებისთვის', img: '🧸' },
  ];

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

  useEffect(() => { setMounted(true); fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  // Функция центрирования категории при клике
  const scrollToCategory = (e, id) => {
    setTempCat(id);
    const container = scrollRef.current;
    const item = e.currentTarget;
    if (container && item) {
      const containerWidth = container.offsetWidth;
      const itemOffset = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      // Вычисляем позицию так, чтобы центр айтема совпал с центром контейнера
      const scrollPos = itemOffset - (containerWidth / 2) + (itemWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`p-4 sticky top-0 z-50 border-b backdrop-blur-md ${darkMode ? 'bg-[#1e293b]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">განცხადება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 text-center opacity-40">
        <p>მთავარი გვერდის კონტენტი...</p>
      </div>

      {/* MODAL - С ПЛАВНЫМ СКРОЛЛОМ И ТУМАННОСТЬЮ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-[3.5rem] p-8 sm:p-12 relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'} shadow-2xl`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-2xl opacity-30">✕</button>
            
            <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter">გამოქვეყნება</h2>
            
            <div className="space-y-8">
              {/* Название */}
              <input 
                type="text" placeholder="რა ნივთს ყიდით?" 
                className={`w-full p-6 rounded-2xl font-bold outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                value={tempTitle} onChange={(e) => setTempTitle(e.target.value)}
              />

              {/* КАТЕГОРИИ С ТУМАННОСТЬЮ И ЦЕНТРИРОВАНИЕМ */}
              <div className="space-y-3 relative">
                <p className="text-[10px] font-black opacity-30 ml-2 uppercase">კატეგორია</p>
                
                <div className="relative flex items-center">
                  {/* Левая туманность */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent`} />
                  
                  {/* Контейнер скролла */}
                  <div 
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto py-2 px-12 no-scrollbar scroll-smooth"
                    style={{ scrollSnapType: 'x proximity' }}
                  >
                    {CATEGORIES.slice(1).map(c => (
                      <button 
                        key={c.id} 
                        onClick={(e) => scrollToCategory(e, c.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all border-2 ${
                          tempCat === c.id 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-110' 
                          : 'bg-slate-100 dark:bg-slate-800 border-transparent opacity-60 hover:opacity-100'
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                      >
                        <span className="text-xl">{c.img}</span>
                        <span className="text-sm whitespace-nowrap">{c.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Правая туманность */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent`} />
                </div>
              </div>

              {/* ГОРОДА */}
              <div className="space-y-3">
                <p className="text-[10px] font-black opacity-30 ml-2 uppercase">ქალაქი</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(city => (
                    <button 
                      key={city} 
                      onClick={() => setTempLocation(city)}
                      className={`px-5 py-3 rounded-2xl text-xs font-black transition-all ${
                        tempLocation === city ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-slate-800 opacity-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Цена */}
              <div className="space-y-2">
                 <p className="text-[10px] font-black opacity-30 ml-2 uppercase">ფასი</p>
                 <input 
                  type="number" placeholder="0 ₾" 
                  className={`w-full p-8 rounded-[2.5rem] text-4xl font-black outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                  value={tempPrice} onChange={(e) => setTempPrice(e.target.value)}
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all">
                გამოქვეყნება
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
