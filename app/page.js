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

  // Состояния для публикации
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const ADS = [
    { text: "GAVITO — შენი საიმედო მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "ენდე ჩვენს AI შემფასებელს — გაიგე რეალური ფასი", img: "🤖", color: "from-purple-600 to-pink-600" },
  ];

  const CATEGORIES = [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500' },
    { id: 'realestate', name: 'უძრავი ქონება', img: '🏠', color: 'from-emerald-400 to-teal-600' },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600' },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500' },
    { id: 'beauty', name: 'მოვლა', img: '💄', color: 'from-rose-400 to-fuchsia-500' },
  ];

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

  const MARKET_LIMITS = {
    tech: { max: 15000 }, cars: { max: 500000 }, fashion: { max: 7000 }, beauty: { max: 3000 }
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const getAiAdvice = () => {
    if (!tempPrice || !tempTitle) return null;
    const price = parseFloat(tempPrice);
    const limit = MARKET_LIMITS[tempCat];
    if (limit && price > limit.max) return "🚨 ფასი ზედმეტად მაღალია ამ კატეგორიისთვის!";
    if (price < 5) return "⚠️ ფასი ძალიან დაბალია.";
    return "✅ ფასი ოპტიმალურია!";
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'} transition-all duration-500`}>
      
      {/* Header */}
      <header className={`p-4 sticky top-0 z-50 border-b ${darkMode ? 'bg-[#1e293b]/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Список товаров (упрощенно) */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
               <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-4 overflow-hidden">
                 <img src={p.image} className="w-full h-full object-cover" alt="" />
               </div>
               <h3 className="font-bold px-2 truncate">{p.title}</h3>
               <p className="text-blue-600 font-black text-xl mt-2 px-2">{p.price} ₾</p>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL - ПРИЯТНАЯ ПУБЛИКАЦИЯ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-[3.5rem] p-8 sm:p-12 relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'} shadow-2xl my-auto`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-2xl opacity-30 hover:opacity-100 transition-opacity">✕</button>
            
            <h2 className="text-4xl font-black mb-8 text-center tracking-tighter uppercase">რა გავყიდოთ?</h2>
            
            <div className="space-y-8">
              {/* Выбор Фото */}
              <div className="relative group mx-auto w-full max-w-[280px]">
                <label className="flex flex-col items-center justify-center aspect-square border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all overflow-hidden relative">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl mb-2">📸</div>
                      <p className="text-[10px] font-black uppercase opacity-40">დაამატე ფოტო</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
                </label>
              </div>

              {/* Название */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase opacity-40 ml-4">სათაური</p>
                <input 
                  type="text" placeholder="მაგ: iPhone 16 Pro Max" 
                  className={`w-full p-6 rounded-[2rem] font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                  value={tempTitle} onChange={(e) => setTempTitle(e.target.value)}
                />
              </div>

              {/* ПРИЯТНЫЕ ПЛАШКИ КАТЕГОРИЙ */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 ml-4">აირჩიე კატეგორია</p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {CATEGORIES.slice(1).map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => setTempCat(cat.id)}
                      className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-full font-bold transition-all border-2 ${
                        tempCat === cat.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                        : 'bg-slate-100 dark:bg-slate-800 border-transparent opacity-60'
                      }`}
                    >
                      <span>{cat.img}</span>
                      <span className="text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ПРИЯТНЫЕ ПЛАШКИ ГОРОДОВ */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 ml-4">ლოკაცია</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(city => (
                    <button 
                      key={city} 
                      onClick={() => setTempLocation(city)}
                      className={`px-5 py-3 rounded-2xl text-xs font-black transition-all ${
                        tempLocation === city 
                        ? 'bg-emerald-500 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 opacity-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Цена + ИИ */}
              <div className="space-y-4">
                <div className="relative">
                   <p className="text-[10px] font-black uppercase opacity-40 ml-4 mb-2">ფასი</p>
                   <input 
                    type="number" placeholder="0.00 ₾" 
                    className={`w-full p-8 rounded-[2.5rem] text-4xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                    value={tempPrice} onChange={(e) => { setTempPrice(e.target.value); setIsAnalyzing(true); setTimeout(()=>setIsAnalyzing(false), 500); }}
                  />
                </div>

                {/* AI ПЛАШКА */}
                {tempPrice && tempTitle && (
                  <div className={`p-6 rounded-[2.5rem] text-white transition-all duration-500 animate-pulse-slow shadow-xl ${getAiAdvice().includes('🚨') ? 'bg-red-500' : 'bg-gradient-to-br from-indigo-600 to-blue-700'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-70">GAVITO AI ინსპექტორი</p>
                        <p className="text-sm font-bold">{isAnalyzing ? "ანალიზი..." : getAiAdvice()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 active:scale-95 transition-all">
                გამოქვეყნება
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
