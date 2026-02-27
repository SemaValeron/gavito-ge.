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

  // Состояния формы
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Рекламный цикл
  const [currentAd, setCurrentAd] = useState(0);
  const adRef = useRef(null);
  const isVisible = useRef(true);

  // --- РАСШИРЕННАЯ БАЗА ЗНАНИЙ ИИ ---
  const MARKET_DATA = {
    // Авто
    'toyota prius': 15000, 'bmw e60': 18000, 'mercedes c': 25000, 'tesla': 65000, 'ford transit': 12000,
    // Техника
    'iphone 16': 3500, 'iphone 15': 2200, 'ps5': 1300, 'macbook': 4200, 'dyson': 1400,
    // Одежда (Бренды)
    'nike': 250, 'adidas': 200, 'zara': 100, 'gucci': 1500, 'levis': 180, 'jeans': 80,
    // Косметика и Уход
    'dior': 350, 'chanel': 400, 'creave': 60, 'ordinary': 45, 'parfume': 250,
    // Недвижимость (аренда примерная)
    'ბინა': 1500, 'სახლი': 3000, 'apartment': 1200
  };

  const ADS = [
    { text: "GAVITO — შენი საიმედო მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "ენდე ჩვენს AI შემფასებელს — გაიგე რეალური ფასი", img: "🤖", color: "from-purple-600 to-pink-600" },
    { text: "გაყიდე სწრაფად და მარტივად ჩვენთან", img: "⚡", color: "from-orange-500 to-red-600" },
    { text: "საუკეთესო შემოთავაზებები მთელ საქართველოში", img: "🇬🇪", color: "from-emerald-500 to-teal-700" },
  ];

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

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი', 'მცხეთა'];

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const interval = setInterval(() => {
      if (isVisible.current) setCurrentAd((prev) => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  // --- ЛОГИКА ИИ ОЦЕНЩИКА ---
  const getAiAdvice = () => {
    if (!tempPrice || !tempTitle) return null;
    const p = parseFloat(tempPrice);
    const titleLower = tempTitle.toLowerCase();
    
    let key = Object.keys(MARKET_DATA).find(k => titleLower.includes(k));
    
    if (key) {
      const marketPrice = MARKET_DATA[key];
      if (p < marketPrice * 0.4) return "⚠️ ფასი ძალიან დაბალია! დარწმუნდით, რომ ნივთს ხარვეზი არ აქვს.";
      if (p > marketPrice * 1.4) return "📈 ფასი აჭარბებს საბაზრო ღირებულებას. შესაძლოა გაყიდვა გაჭიანურდეს.";
      return "✅ შესანიშნავი ფასია! ამ ღირებულებით მყიდველს მალე იპოვით.";
    }
    // Если товара нет в базе, даем общие советы по категориям
    if (tempCat === 'cars' && p < 2000) return "🧐 ავტომობილისთვის ფასი საეჭვოდ დაბალია.";
    if (tempCat === 'beauty' && p > 500) return "✨ პრემიუმ კლასის მოვლის საშუალებაა? ფასი საკმაოდ მაღალია.";
    
    return "🔍 ფასი ოპტიმალური ჩანს ამ კატეგორიისთვის.";
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
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`p-4 sticky top-0 z-50 border-b ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer" onClick={() => setSelectedCategory('all')}>GAVITO</div>
          <div className="flex-1 hidden md:block">
            <input 
              type="text" placeholder="მოძებნე ყველაფერი..." 
              className={`w-full p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg">განცხადება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Banner */}
        <div ref={adRef} className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[3rem] shadow-2xl bg-slate-800">
          {ADS.map((ad, index) => (
            <div key={index} className={`absolute inset-0 w-full h-full flex items-center p-12 bg-gradient-to-r ${ad.color} transition-all duration-1000 ${index === currentAd ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="text-6xl mr-8 animate-bounce">{ad.img}</div>
              <div className="text-3xl font-black text-white max-w-xl">{ad.text}</div>
              <div className="absolute top-6 right-8 text-white/20 font-black text-2xl tracking-tighter">GAVITO</div>
            </div>
          ))}
        </div>

        {/* Categories Grid - С ИСПРАВЛЕННЫМ ШРИФТОМ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center p-5 rounded-[2.5rem] transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white scale-105 shadow-xl' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 hover:border-blue-400'}`}>
              <div className={`w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-md`}>{cat.img}</div>
              <span className="text-[12px] font-bold tracking-normal text-center leading-tight px-1">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => (selectedCategory === 'all' || p.category === selectedCategory)).map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
              <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-4 overflow-hidden flex items-center justify-center">
                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <span className="text-5xl opacity-20">📦</span>}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black">{p.location}</div>
              </div>
              <h3 className="font-bold text-lg truncate px-2">{p.title}</h3>
              <div className="flex justify-between items-center px-2 mt-4">
                <span className="text-2xl font-black text-blue-600">{p.price} ₾</span>
                <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:scale-110 transition-transform">💙</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL С ИИ ОЦЕНЩИКОМ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[3.5rem] p-10 relative shadow-2xl animate-in zoom-in duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-xl opacity-50">✕</button>
            <h2 className="text-3xl font-black mb-8 uppercase text-center tracking-tighter">გამოქვეყნება</h2>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] cursor-pointer hover:border-blue-500 overflow-hidden bg-slate-50 dark:bg-slate-800">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-xs font-black opacity-50 uppercase">📸 ფოტოს დამატება</span>}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
              </label>

              <input type="text" placeholder="რა ნივთს ყიდით?" className={`w-full p-5 rounded-2xl font-bold outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
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

              {/* ИИ ОЦЕНЩИК (ОБНОВЛЕННЫЙ) */}
              {(tempPrice && tempTitle) && (
                <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] text-white animate-bounce-short shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🤖</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">GAVITO AI SMART</span>
                  </div>
                  <p className="text-sm font-bold leading-tight">
                    {isAnalyzing ? "ბაზრის მონაცემების შემოწმება..." : getAiAdvice()}
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
