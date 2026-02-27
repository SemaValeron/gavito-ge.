'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  
  // Глобальные фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ყველა');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Форма публикации
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollRef = useRef(null);
  const [currentAd, setCurrentAd] = useState(0);

  const ADS = [
    { text: "GAVITO — შენი საიმედო მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "ენდე ჩვენს AI შემფასებელს", img: "🤖", color: "from-purple-600 to-pink-600" },
    { text: "საუკეთესო შემოთავაზებები საქართველოში", img: "🇬🇪", color: "from-emerald-500 to-teal-700" },
  ];

  const CATEGORIES = [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500' },
    { id: 'realestate', name: 'უძრავი ქონება', img: '🏠', color: 'from-emerald-400 to-teal-600' },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600' },
    { id: 'home', name: 'სახლი და ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500' },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500' },
    { id: 'beauty', name: 'მოვლა და პარფიუმი', img: '💄', color: 'from-rose-400 to-fuchsia-500' },
  ];

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი'];

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const timer = setInterval(() => setCurrentAd(p => (p + 1) % ADS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = selectedCity === 'ყველა' || p.location === selectedCity;
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCity && matchCat;
    });
  }, [products, searchQuery, selectedCity, selectedCategory]);

  const aiVerdict = useMemo(() => {
    if (!tempPrice || !tempTitle) return { text: "", status: "idle" };
    const price = parseFloat(tempPrice);
    if (price > 20000) return { text: "❌ ფასი გადაჭარბებულია", status: "error" };
    return { text: "✅ ოპტიმალური ფასი", status: "success" };
  }, [tempPrice, tempTitle]);

  const handleCategorySelect = (e, id) => {
    setTempCat(id);
    const container = scrollRef.current;
    if (container && e.currentTarget) {
      const scrollPos = e.currentTarget.offsetLeft - (container.offsetWidth / 2) + (e.currentTarget.offsetWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-700 ${darkMode ? 'bg-[#0b0f1a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`p-4 sticky top-0 z-50 border-b backdrop-blur-xl ${darkMode ? 'bg-[#0b0f1a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer hover:opacity-80 transition-all" onClick={() => {setSelectedCategory('all'); setSearchQuery('');}}>GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl hover:rotate-12 transition-all">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* BANNER */}
        <div className="relative w-full h-48 sm:h-64 mb-8 overflow-hidden rounded-[3rem] shadow-2xl bg-slate-800 group">
          {ADS.map((ad, index) => (
            <div key={index} className={`absolute inset-0 w-full h-full flex items-center p-8 sm:p-12 bg-gradient-to-r ${ad.color} transition-all duration-1000 ${index === currentAd ? 'opacity-100' : 'opacity-0 scale-105'}`}>
              <div className="text-5xl sm:text-7xl mr-8 animate-bounce">{ad.img}</div>
              <div className="text-2xl sm:text-4xl font-black text-white max-w-2xl leading-tight">{ad.text}</div>
            </div>
          ))}
        </div>

        {/* ПОИСК И ГОРОД */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className={`flex-1 flex items-center px-6 py-5 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 focus-within:border-blue-500' : 'bg-white border-slate-200 focus-within:shadow-xl focus-within:border-blue-400'}`}>
            <span className="mr-4 text-xl">🔍</span>
            <input 
              type="text" placeholder="მოძებნე სასურველი ნივთი..." 
              className="w-full bg-transparent outline-none font-bold text-lg"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className={`px-8 py-5 rounded-3xl font-bold outline-none border transition-all cursor-pointer ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500' : 'bg-white border-slate-200 hover:shadow-lg'}`}
            value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="ყველა">ყველა ქალაქი</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* CATEGORIES (С ЭФФЕКТОМ УВЕЛИЧЕНИЯ) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              className={`group flex flex-col items-center p-6 rounded-[2.5rem] transition-all duration-300 ease-out border
                ${selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40 scale-110 -translate-y-2 border-transparent' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:border-blue-400'
                }`}
            >
              <div className={`w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-lg transition-transform duration-500 group-hover:rotate-12`}>
                {cat.img}
              </div>
              <span className="text-[11px] font-black uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="group bg-white dark:bg-slate-900 p-5 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative aspect-square rounded-[2rem] mb-4 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm">{p.location}</div>
              </div>
              <h3 className="font-bold text-lg px-2 truncate group-hover:text-blue-600 transition-colors">{p.title}</h3>
              <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-2xl font-black text-blue-600">{p.price} ₾</p>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">❤️</div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL (ПОЛНЫЙ UX КОМПЛЕКТ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-[3.5rem] relative ${darkMode ? 'bg-[#0b0f1a] border border-slate-800' : 'bg-white'} shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]`}>
            
            {/* Liquid Glass Header */}
            <div className={`sticky top-0 z-20 p-8 pb-5 backdrop-blur-2xl ${darkMode ? 'bg-slate-900/40' : 'bg-white/40'} border-b border-white/10 flex items-center justify-between`}>
              <h2 className="text-3xl font-black uppercase tracking-tighter">განთავსება</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 hover:rotate-90 transition-all">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto modal-scroll p-8 pt-4 space-y-7">
              <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] cursor-pointer bg-slate-50 dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/10 transition-all group">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : (
                  <div className="text-center group-hover:scale-110 transition-transform"><span className="text-5xl">📸</span><p className="text-[10px] font-black opacity-40 mt-3 tracking-widest uppercase">ფოტოს დამატება</p></div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
              </label>

              <div className="space-y-4">
                <input type="text" placeholder="ნივთის დასახელება" className={`w-full p-6 rounded-3xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                
                <div className="relative group">
                  <div className={`absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r ${darkMode ? 'from-[#0b0f1a]' : 'from-white'} to-transparent pointer-events-none`} />
                  <div ref={scrollRef} className="flex gap-4 overflow-x-auto py-5 px-10 custom-scrollbar scroll-smooth snap-x">
                    {CATEGORIES.slice(1).map(c => (
                      <button key={c.id} onClick={(e) => handleCategorySelect(e, c.id)} className={`flex-shrink-0 px-8 py-3 rounded-full text-xs font-black transition-all snap-center ${tempCat === c.id ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 opacity-60 hover:opacity-100'}`}>{c.name}</button>
                    ))}
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l ${darkMode ? 'from-[#0b0f1a]' : 'from-white'} to-transparent pointer-events-none`} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {CITIES.map(city => (
                  <button key={city} onClick={() => setTempLocation(city)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${tempLocation === city ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 opacity-40 hover:opacity-100'}`}>{city}</button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input type="number" placeholder="ფასი" className={`w-full p-7 rounded-[2.5rem] text-4xl font-black outline-none border-2 border-transparent focus:border-blue-500 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`} value={tempPrice} onChange={(e) => { setTempPrice(e.target.value); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 600); }} />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black opacity-20">₾</span>
                </div>

                <div className={`p-7 rounded-[2.5rem] text-white transition-all duration-700 ease-in-out ${tempPrice && tempTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'} ${aiVerdict.status === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-xl shadow-red-500/20' : 'bg-gradient-to-r from-indigo-600 to-blue-700 shadow-xl shadow-blue-500/20'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl ${isAnalyzing ? 'animate-spin' : 'animate-bounce'}`}>🤖</span>
                    <div>
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">AI Verdict</p>
                      <p className="text-lg font-bold">{isAnalyzing ? "ანალიზი..." : aiVerdict.text}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-7 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; margin: 30px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
