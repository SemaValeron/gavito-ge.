'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Форма товара
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const adRef = useRef(null);
  const [currentAd, setCurrentAd] = useState(0);

  // --- БАЗА ДАННЫХ ДЛЯ ИИ (Рыночные лимиты) ---
  const MARKET_LIMITS = {
    tech: { min: 20, max: 10000, label: 'ტექნიკა' },
    cars: { min: 1000, max: 300000, label: 'ავტომობილი' },
    fashion: { min: 5, max: 5000, label: 'ტანსაცმელი' },
    beauty: { min: 5, max: 2000, label: 'მოვლა' },
    realestate: { min: 100, max: 1000000, label: 'უძრავი ქონება' }
  };

  const SPECIFIC_ITEMS = {
    'iphone 16': 3500, 'iphone 15': 2400, 'ps5': 1400, 'bmw': 25000, 
    'toyota': 15000, 'nike': 300, 'dyson': 1500, 'rolex': 30000
  };

  const ADS = [
    { text: "GAVITO — შენი საიმედო მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "ენდე ჩვენს AI შემფასებელს — გაიგე რეალური ფასი", img: "🤖", color: "from-purple-600 to-pink-600" },
    { text: "გაყიდე სწრაფად და მარტივად ჩვენთან", img: "⚡", color: "from-orange-500 to-red-600" },
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
    const interval = setInterval(() => setCurrentAd(p => (p + 1) % ADS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  // --- УЛУЧШЕННЫЙ ИИ ОЦЕНЩИК ---
  const getAiAdvice = () => {
    if (!tempPrice || !tempTitle) return null;
    const price = parseFloat(tempPrice);
    const title = tempTitle.toLowerCase();
    
    // 1. Проверка конкретных моделей
    let matchedItem = Object.keys(SPECIFIC_ITEMS).find(key => title.includes(key));
    if (matchedItem) {
      const refPrice = SPECIFIC_ITEMS[matchedItem];
      if (price > refPrice * 1.5) return `❌ ფასი ზედმეტად მაღალია! ამ ნივთის საბაზრო ფასი დაახლოებით ${refPrice} ₾-ია.`;
      if (price < refPrice * 0.4) return `⚠️ ფასი საეჭვოდ დაბალია. დარწმუნდით, რომ ნივთი ორიგინალია.`;
      return `✅ შესანიშნავი ფასია! ნივთი ბაზრის შესაბამისია.`;
    }

    // 2. Категориальная проверка (Ловушка на огромные суммы)
    const limit = MARKET_LIMITS[tempCat];
    if (limit) {
      if (price > limit.max) return `🚨 შეცდომა? ${limit.label} ამ ფასად თითქმის არასოდეს იყიდება. შეამცირეთ ფასი!`;
      if (price < limit.min) return `🧐 ძალიან იაფია ${limit.label}-სთვის. შეამოწმეთ ციფრები.`;
    }

    return "🔍 ფასი ნორმალურ ფარგლებშია.";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    const { error } = await supabase.from('products').insert([{ 
      title: tempTitle, price: parseFloat(tempPrice), category: tempCat,
      location: tempLocation, image: previewUrl || 'https://via.placeholder.com/400'
    }]);
    if (!error) {
      setIsModalOpen(false);
      setTempTitle(''); setTempPrice(''); setPreviewUrl(null);
      fetchProducts();
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'} transition-all duration-500`}>
      
      {/* Header */}
      <header className={`p-4 sticky top-0 z-50 border-b ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black">განცხადება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Ad Banner */}
        <div className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[3rem] shadow-2xl bg-slate-800">
          {ADS.map((ad, index) => (
            <div key={index} className={`absolute inset-0 flex items-center p-12 bg-gradient-to-r ${ad.color} transition-opacity duration-1000 ${index === currentAd ? 'opacity-100 z-10' : 'opacity-0'}`}>
              <div className="text-6xl mr-8">{ad.img}</div>
              <div className="text-3xl font-black text-white">{ad.text}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center p-5 rounded-[2.5rem] transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white scale-105 shadow-xl' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'}`}>
              <div className={`w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-md`}>{cat.img}</div>
              <span className="text-[12px] font-bold tracking-normal">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => (selectedCategory === 'all' || p.category === selectedCategory)).map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-4 overflow-hidden flex items-center justify-center">
                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <span className="text-5xl opacity-20">📦</span>}
              </div>
              <h3 className="font-bold text-lg px-2">{p.title}</h3>
              <div className="flex justify-between items-center px-2 mt-4">
                <span className="text-2xl font-black text-blue-600">{p.price} ₾</span>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL С «УМНЫМ» ИИ ОЦЕНЩИКОМ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[3.5rem] p-10 relative ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-xl opacity-50">✕</button>
            <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter">გამოქვეყნება</h2>
            
            <div className="space-y-4">
              {/* Фото */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] cursor-pointer hover:border-blue-500 overflow-hidden bg-slate-50 dark:bg-slate-800">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-xs font-black opacity-50 uppercase">📸 ფოტოს დამატება</span>}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
              </label>

              <input type="text" placeholder="რა ნივთს ყიდით? (მაგ: iPhone 16)" className={`w-full p-5 rounded-2xl font-bold outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className={`p-5 rounded-2xl font-bold outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className={`p-5 rounded-2xl font-bold outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <input 
                type="number" placeholder="ფასი (₾)" 
                className={`w-full p-5 rounded-2xl font-bold outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} 
                value={tempPrice} 
                onChange={(e) => {
                  setTempPrice(e.target.value);
                  setIsAnalyzing(true);
                  setTimeout(() => setIsAnalyzing(false), 600);
                }} 
              />

              {/* ИИ ОЦЕНЩИК (ОТЛАВЛИВАЕТ ОШИБКИ) */}
              {(tempPrice && tempTitle) && (
                <div className={`p-5 rounded-[2rem] text-white animate-pulse-short shadow-xl ${getAiAdvice()?.includes('❌') || getAiAdvice()?.includes('🚨') ? 'bg-red-500' : 'bg-indigo-600'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🤖</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">GAVITO AI ENGINE</span>
                  </div>
                  <p className="text-sm font-bold leading-tight">
                    {isAnalyzing ? "მიმდინარეობს ანალიზი..." : getAiAdvice()}
                  </p>
                </div>
              )}

              <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all mt-4">განთავსება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
