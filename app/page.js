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

  // Состояния формы публикации
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

  // Реф для скролла категорий
  const scrollRef = useRef(null);

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

  // Лимиты для ИИ Оценщика
  const MARKET_LIMITS = {
    tech: { min: 20, max: 12000, label: 'ტექნიკა' },
    cars: { min: 1000, max: 400000, label: 'ავტომობილი' },
    fashion: { min: 10, max: 6000, label: 'ტანსაცმელი' },
    beauty: { min: 5, max: 2500, label: 'მოვლა' },
    realestate: { min: 200, max: 2000000, label: 'უძრავი ქონება' }
  };

  const SPECIFIC_ITEMS = {
    'iphone 16': 3500, 'iphone 15': 2400, 'ps5': 1400, 'bmw': 25000, 'toyota': 15000, 'nike': 350, 'dyson': 1500
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const timer = setInterval(() => {
      if (isVisible.current) setCurrentAd(prev => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  // Центрирование категории при клике
  const handleCategorySelect = (e, id) => {
    setTempCat(id);
    const container = scrollRef.current;
    const item = e.currentTarget;
    if (container && item) {
      const scrollPos = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  const getAiAdvice = () => {
    if (!tempPrice || !tempTitle) return null;
    const price = parseFloat(tempPrice);
    const title = tempTitle.toLowerCase();
    let matchedItem = Object.keys(SPECIFIC_ITEMS).find(k => title.includes(k));
    
    if (matchedItem) {
      const ref = SPECIFIC_ITEMS[matchedItem];
      if (price > ref * 1.5) return `❌ ზედმეტად ძვირია! საშუალო ფასია დაახლოებით ${ref} ₾.`;
      if (price < ref * 0.4) return `⚠️ ფასი ძალიან დაბალია. შეამოწმეთ ნივთის მდგომარეობა.`;
      return "✅ იდეალური საბაზრო ფასია!";
    }
    const limit = MARKET_LIMITS[tempCat];
    if (limit && price > limit.max) return `🚨 შეცდომაა? ${limit.label} ასეთ ფასად იშვიათია.`;
    return "🔍 ფასი ოპტიმალურია ამ კატეგორიისთვის.";
  };

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    const { error } = await supabase.from('products').insert([{ 
      title: tempTitle, price: parseFloat(tempPrice), category: tempCat, 
      location: tempLocation, image: previewUrl || 'https://via.placeholder.com/400' 
    }]);
    if (!error) { setIsModalOpen(false); setTempTitle(''); setTempPrice(''); setPreviewUrl(null); fetchProducts(); }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`p-4 sticky top-0 z-50 border-b backdrop-blur-md ${darkMode ? 'bg-[#1e293b]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer" onClick={() => setSelectedCategory('all')}>GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Banner */}
        <div ref={adRef} className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[3rem] shadow-2xl bg-slate-800">
          {ADS.map((ad, index) => (
            <div key={index} className={`absolute inset-0 w-full h-full flex items-center p-8 sm:p-12 bg-gradient-to-r ${ad.color} transition-all duration-1000 ${index === currentAd ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="text-5xl sm:text-7xl mr-8">{ad.img}</div>
              <div className="text-2xl sm:text-4xl font-black text-white max-w-2xl leading-tight">{ad.text}</div>
            </div>
          ))}
        </div>

        {/* Categories Grid Главная */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center p-5 rounded-[2.5rem] transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white scale-105 shadow-xl' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'}`}>
              <div className={`w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-md`}>{cat.img}</div>
              <span className="text-[12px] font-bold tracking-normal text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => (selectedCategory === 'all' || p.category === selectedCategory)).map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-4 overflow-hidden flex items-center justify-center">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black">{p.location}</div>
              </div>
              <h3 className="font-bold text-lg px-2">{p.title}</h3>
              <div className="flex justify-between items-center px-2 mt-4">
                <span className="text-2xl font-black text-blue-600">{p.price} ₾</span>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL - ВСЁ ВКЛЮЧЕНО */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-[3.5rem] p-8 sm:p-12 relative ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'} shadow-2xl my-auto`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-2xl opacity-30">✕</button>
            <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter">გამოქვეყნება</h2>
            
            <div className="space-y-6">
              {/* Фото */}
              <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-800">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : (
                  <div className="text-center"><span className="text-4xl">📸</span><p className="text-[10px] font-black opacity-40 mt-2 uppercase">ფოტოს დამატება</p></div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
              </label>

              <input type="text" placeholder="რა ნივთს ყიდით?" className={`w-full p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              {/* КАТЕГОРИИ С ТУМАННОСТЬЮ И ЦЕНТРИРОВАНИЕМ */}
              <div className="space-y-2 relative">
                <p className="text-[10px] font-black opacity-30 ml-2 uppercase">კატეგორია</p>
                <div className="relative flex items-center">
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent`} />
                  <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-2 px-10 no-scrollbar scroll-smooth">
                    {CATEGORIES.slice(1).map(c => (
                      <button key={c.id} onClick={(e) => handleCategorySelect(e, c.id)} className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black transition-all ${tempCat === c.id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}>{c.name}</button>
                    ))}
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent`} />
                </div>
              </div>

              {/* ГОРОДА-ЧИПСЫ */}
              <div className="space-y-2">
                <p className="text-[10px] font-black opacity-30 ml-2 uppercase">ქალაქი</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(city => (
                    <button key={city} onClick={() => setTempLocation(city)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${tempLocation === city ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 opacity-50'}`}>{city}</button>
                  ))}
                </div>
              </div>

              {/* Цена + ИИ */}
              <div className="space-y-4">
                <input 
                  type="number" placeholder="ფასი (₾)" 
                  className={`w-full p-6 rounded-[2rem] text-3xl font-black outline-none border-2 border-transparent focus:border-blue-500 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} 
                  value={tempPrice} onChange={(e) => { setTempPrice(e.target.value); setIsAnalyzing(true); setTimeout(()=>setIsAnalyzing(false), 500); }} 
                />

                {tempPrice && tempTitle && (
                  <div className={`p-5 rounded-[2rem] text-white shadow-xl ${getAiAdvice().includes('❌') || getAiAdvice().includes('🚨') ? 'bg-red-500' : 'bg-indigo-600'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🤖</span>
                      <span className="text-[9px] font-black opacity-70 uppercase tracking-widest">GAVITO AI ENGINE</span>
                    </div>
                    <p className="text-sm font-bold">{isAnalyzing ? "ანალიზი..." : getAiAdvice()}</p>
                  </div>
                )}
              </div>

              <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-xl active:scale-95 transition-all">განთავსება</button>
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
