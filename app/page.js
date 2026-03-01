'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';

// 🛑 ВСТАВЬ СВОЮ ССЫЛКУ ИЗ CODESPACES (ПОРТ 8080)
const JAVA_API_URL = "https://your-java-link-8080.app.github.dev/api/products";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ყველა');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Форма публикации
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [mainImage, setMainImage] = useState('');
  const [extraImages, setExtraImages] = useState(['', '', '', '']);

  const CITIES = [
    { name: 'ყველა', icon: '🇬🇪' },
    { name: 'თბილისი', icon: '🏙️' },
    { name: 'ბათუმი', icon: '🌊' },
    { name: 'ქუთაისი', icon: '🏛️' },
    { name: 'რუსთავი', icon: '🏭' },
    { name: 'გორი', icon: '🏰' }
  ];

  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500', basePrice: 15000 },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600', basePrice: 120000 },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600', basePrice: 1500 },
    { id: 'home', name: 'ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500', basePrice: 400 },
    { id: 'fashion', name: 'მოდა', img: '👕', color: 'from-sky-400 to-blue-500', basePrice: 150 },
  ], []);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Error:", err); }
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ სათაური და ფასი!");
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
      if (response.ok) {
        setIsModalOpen(false);
        setTempTitle(''); setTempPrice(''); setMainImage('');
        fetchProducts();
      }
    } catch (e) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#05070a] text-white' : 'bg-[#f0f2f5] text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-[100] backdrop-blur-2xl bg-white/70 dark:bg-black/70 border-b dark:border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">GAVITO</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 text-xl hover:rotate-12 transition-all">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
              გამოქვეყნება
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* НОВЫЙ ВЫБОР ГОРОДОВ (CHIPS) */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar items-center">
          <span className="font-black uppercase text-[10px] opacity-40 mr-2 rotate-[-90deg]">ქალაქი</span>
          {CITIES.map(city => (
            <button 
              key={city.name} 
              onClick={() => setSelectedCity(city.name)}
              className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 border-2 ${selectedCity === city.name ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-transparent bg-white dark:bg-white/5 shadow-sm'}`}
            >
              <span>{city.icon}</span> {city.name}
            </button>
          ))}
        </div>

        {/* ПОИСК */}
        <div className="relative mb-12 group">
          <input 
            type="text" 
            placeholder="რას ეძებთ დღეს?" 
            className="w-full p-6 pl-14 rounded-[2.5rem] bg-white dark:bg-white/5 border-2 border-transparent focus:border-blue-500 outline-none text-xl font-medium shadow-2xl transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-6 top-7 text-2xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
        </div>

        {/* КАТЕГОРИИ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative overflow-hidden p-6 rounded-[2.5rem] transition-all group ${selectedCategory === cat.id ? 'scale-95 ring-4 ring-blue-500/20' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl mb-3 transform group-hover:scale-125 transition-transform">{cat.img}</span>
                <span className="font-black text-[11px] uppercase tracking-tighter">{cat.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* СЕТКА ТОВАРОВ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products
            .filter(p => (selectedCategory === 'all' || p.category === selectedCategory) && (selectedCity === 'ყველა' || p.location === selectedCity))
            .map((p) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border dark:border-white/10 p-3 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                  <img src={p.imageUrl} className="w-full aspect-[4/5] object-cover rounded-[2.5rem] mb-4 group-hover:scale-105 transition-transform duration-500" alt="" />
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg leading-tight truncate w-3/4">{p.title}</h3>
                      <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-lg italic">NEW</span>
                    </div>
                    <p className="text-3xl font-black text-blue-600 mb-2">{p.price} ₾</p>
                    <div className="flex items-center gap-2 opacity-40 text-[10px] font-bold">
                      <span>📍 {p.location}</span>
                      <span>•</span>
                      <span>2 წუთის წინ</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* МОДАЛКА ПУБЛИКАЦИИ С МУЛЬТИ-ФОТО */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-[4rem] max-h-[90vh] overflow-y-auto p-10 ${darkMode ? 'bg-[#0f172a] border border-white/10' : 'bg-white'} nice-scroll animate-in fade-in zoom-in duration-300`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black tracking-tighter">განცხადების დამატება</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">✕</button>
            </div>

            <div className="space-y-6">
              {/* ФОТО БЛОК */}
              <div className="grid grid-cols-5 gap-2 h-32">
                <div className="col-span-2 relative group cursor-pointer border-2 border-dashed border-blue-500/30 rounded-3xl flex items-center justify-center bg-blue-500/5">
                  <input type="text" placeholder="URL მთავარი ფოტო" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setMainImage(e.target.value)} />
                  {mainImage ? <img src={mainImage} className="absolute inset-0 w-full h-full object-cover rounded-3xl" /> : <span className="text-xs font-bold text-blue-600">+ მთავარი</span>}
                </div>
                {extraImages.map((img, i) => (
                  <div key={i} className="relative border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl flex items-center justify-center">
                    <input type="text" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      const newImgs = [...extraImages];
                      newImgs[i] = e.target.value;
                      setExtraImages(newImgs);
                    }} />
                    {img ? <img src={img} className="absolute inset-0 w-full h-full object-cover rounded-3xl" /> : <span className="text-xl opacity-20">+</span>}
                  </div>
                ))}
              </div>

              <input type="text" placeholder="რას ყიდით?" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-lg" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input type="number" placeholder="ფასი" className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 outline-none font-black text-2xl text-blue-600" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                  <span className="absolute right-6 top-7 font-black opacity-30">₾</span>
                </div>
                <select className="w-full p-6 rounded-3xl bg-slate-100 dark:bg-white/5 outline-none font-bold" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                  {CITIES.filter(c => c.name !== 'ყველა').map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <button 
                onClick={handlePublish} 
                disabled={isSubmitting}
                className="w-full py-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl shadow-2xl active:scale-95 transition-all"
              >
                {isSubmitting ? 'მიმდინარეობს...' : 'გამოქვეყნება მყისიერად'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
