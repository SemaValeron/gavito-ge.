'use client';
import React, { useState, useEffect, useMemo } from 'react';

const JAVA_API_URL = "https://your-java-link-8080.app.github.dev/api/products";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ყველა');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояния публикации
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [mainImage, setMainImage] = useState('');

  const CITIES = [
    { id: 1, name: 'ყველა', icon: '🇬🇪' },
    { id: 2, name: 'თბილისი', icon: '🏙️' },
    { id: 3, name: 'ბათუმი', icon: '🌊' },
    { id: 4, name: 'ქუთაისი', icon: '🏛️' },
    { id: 5, name: 'რუსთავი', icon: '🏭' },
    { id: 6, name: 'ზუგდიდი', icon: '🌿' }
  ];

  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500' },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600' },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600' },
  ], []);

  useEffect(() => { setMounted(true); fetchProducts(); }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); }
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    setIsSubmitting(true);
    try {
      const response = await fetch(JAVA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tempTitle,
          price: parseFloat(tempPrice),
          category: tempCat,
          location: tempLocation,
          imageUrl: mainImage || 'https://via.placeholder.com/400'
        })
      });
      if (response.ok) { setIsModalOpen(false); fetchProducts(); }
    } finally { setIsSubmitting(false); }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#05070a] text-white' : 'bg-[#f4f7fa] text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-[100] backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b dark:border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black text-blue-600 tracking-tighter">GAVITO</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* ПРОФЕССИОНАЛЬНАЯ ПОИСКОВАЯ СТРОКА С ГОРОДАМИ */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className={`flex flex-col md:flex-row items-stretch p-2 rounded-[2.5rem] shadow-2xl border transition-all ${darkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>
            
            {/* Поле ввода текста */}
            <div className="flex-1 flex items-center px-6 py-4 border-b md:border-b-0 md:border-r dark:border-white/10">
              <span className="text-xl mr-3 opacity-40">🔍</span>
              <input 
                type="text" 
                placeholder="რას ეძებთ დღეს?" 
                className="bg-transparent w-full outline-none font-bold text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Выбор города внутри поиска */}
            <div className="flex-[0.8] flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
              {CITIES.map(city => (
                <button 
                  key={city.id}
                  onClick={() => setSelectedCity(city.name)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap text-xs font-black transition-all ${selectedCity === city.name ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-white/5 opacity-60 hover:opacity-100'}`}
                >
                  {city.icon} {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* КАТЕГОРИИ */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center p-4 rounded-3xl transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white -translate-y-2' : 'bg-white dark:bg-white/5 opacity-60'}`}
            >
              <span className="text-2xl mb-1">{cat.img}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* СЕТКА ТОВАРОВ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products
            .filter(p => (selectedCategory === 'all' || p.category === selectedCategory) && (selectedCity === 'ყველა' || p.location === selectedCity))
            .map((p) => (
              <div key={p.id} className="group bg-white dark:bg-white/5 rounded-[2.5rem] p-4 border dark:border-white/10 hover:shadow-2xl transition-all">
                <img src={p.imageUrl} className="w-full aspect-square object-cover rounded-[2rem] mb-4 group-hover:scale-[1.02] transition-transform" />
                <h3 className="font-bold text-lg px-2 truncate">{p.title}</h3>
                <div className="flex justify-between items-center px-2 mt-2">
                  <p className="text-2xl font-black text-blue-600">{p.price} ₾</p>
                  <span className="text-[10px] font-bold opacity-40">📍 {p.location}</span>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* МОДАЛКА ПУБЛИКАЦИИ С ИНТЕРАКТИВНЫМИ ГОРОДАМИ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-xl rounded-[4rem] p-10 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <h2 className="text-3xl font-black mb-8 tracking-tighter">ახალი განცხადება</h2>
            
            <div className="space-y-6">
              <input type="text" placeholder="სათაური" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 outline-none font-bold" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              {/* ИНТЕРАКТИВНЫЙ ВЫБОР ГОРОДА ПРИ ПУБЛИКАЦИИ */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 ml-4">აირჩიეთ ქალაქი</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.filter(c => c.name !== 'ყველა').map(city => (
                    <button
                      key={city.id}
                      onClick={() => setTempLocation(city.name)}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all transform duration-300 ${tempLocation === city.name ? 'bg-blue-600 text-white scale-110 shadow-xl z-10' : 'bg-slate-100 dark:bg-white/5 opacity-40 scale-90 hover:scale-95'}`}
                    >
                      <div className="text-xl mb-1">{city.icon}</div>
                      <div className="text-[10px]">{city.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="ფასი" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 outline-none font-black text-blue-600" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                <input type="text" placeholder="სურათის URL" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-sm" value={mainImage} onChange={(e) => setMainImage(e.target.value)} />
              </div>

              <button 
                onClick={handlePublish}
                disabled={isSubmitting}
                className="w-full py-8 rounded-[2.5rem] bg-blue-600 text-white font-black text-2xl shadow-2xl active:scale-95 transition-all"
              >
                {isSubmitting ? 'მიმდინარეობს...' : 'გამოქვეყნება'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
