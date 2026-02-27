'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояния формы публикации
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Рефы и Рекламный цикл
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

  // Сверхстабильный ИИ Анализатор
  const aiVerdict = useMemo(() => {
    if (!tempPrice || !tempTitle) return { text: "", status: "idle" };
    const price = parseFloat(tempPrice);
    if (price > 15000) return { text: `❌ ზედმეტად ძვირია!`, status: "error" };
    if (price < 10) return { text: `⚠️ ფასი საეჭვოდ დაბალია`, status: "warning" };
    return { text: "✅ იდეალური საბაზრო ფასია", status: "success" };
  }, [tempPrice, tempTitle]);

  const handleCategorySelect = (e, id) => {
    setTempCat(id);
    const container = scrollRef.current;
    if (container && e.currentTarget) {
      const scrollPos = e.currentTarget.offsetLeft - (container.offsetWidth / 2) + (e.currentTarget.offsetWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
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
    <div className={`min-h-screen transition-all duration-700 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`p-4 sticky top-0 z-50 border-b backdrop-blur-md ${darkMode ? 'bg-[#1e293b]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer" onClick={() => setSelectedCategory('all')}>GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-700 transition-all">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* BANNER */}
        <div className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[3rem] shadow-2xl bg-slate-800">
          {ADS.map((ad, index) => (
            <div key={index} className={`absolute inset-0 w-full h-full flex items-center p-8 sm:p-12 bg-gradient-to-r ${ad.color} transition-all duration-1000 ${index === currentAd ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-5xl sm:text-7xl mr-8">{ad.img}</div>
              <div className="text-2xl sm:text-4xl font-black text-white max-w-2xl leading-tight">{ad.text}</div>
            </div>
          ))}
        </div>

        {/* CATEGORIES MAIN */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center p-5 rounded-[2.5rem] transition-all duration-300 ${selectedCategory === cat.id ? 'bg-blue-600 text-white scale-105 shadow-xl' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 hover:border-blue-500'}`}>
              <div className={`w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-md`}>{cat.img}</div>
              <span className="text-[12px] font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => selectedCategory === 'all' || p.category === selectedCategory).map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.8rem] border dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
              <div className="relative aspect-square rounded-[2rem] mb-4 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black">{p.location}</div>
              </div>
              <h3 className="font-bold text-lg px-2 truncate">{p.title}</h3>
              <p className="text-2xl font-black text-blue-600 px-2 mt-4">{p.price} ₾</p>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL (ПУБЛИКАЦИЯ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-[3.5rem] relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
            
            {/* ШАПКА С ЭФФЕКТОМ ЖИДКОГО СТЕКЛА */}
            <div className={`sticky top-0 z-20 p-8 pb-4 backdrop-blur-xl ${darkMode ? 'bg-slate-900/60' : 'bg-white/60'} flex items-center justify-between`}>
              <h2 className="text-3xl font-black uppercase tracking-tighter">განთავსება</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 opacity-50 hover:opacity-100 transition-all">✕</button>
            </div>

            {/* КОНТЕНТ С КРАСИВЫМ СКРОЛЛБАРОМ ВНУТРИ ГРАНИЦ */}
            <div className="flex-1 overflow-y-auto modal-scroll p-8 pt-4 space-y-6">
              
              {/* Фото / Камера */}
              <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-800 hover:border-blue-500 transition-colors">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : (
                  <div className="text-center"><span className="text-4xl">📸</span><p className="text-[10px] font-black opacity-40 mt-2 uppercase">ფოტოს დამატება</p></div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
              </label>

              <input type="text" placeholder="სათაური" className={`w-full p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              {/* Категории (Ручной скролл + Плавность + Туман) */}
              <div className="relative group">
                <p className="text-[10px] font-black opacity-30 ml-2 mb-2 uppercase tracking-widest">კატეგორია</p>
                <div className="relative flex items-center">
                  <div className={`absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent pointer-events-none`} />
                  <div 
                    ref={scrollRef} 
                    className="flex gap-3 overflow-x-auto py-5 px-10 custom-scrollbar scroll-smooth snap-x touch-pan-x"
                  >
                    {CATEGORIES.slice(1).map(c => (
                      <button key={c.id} onClick={(e) => handleCategorySelect(e, c.id)} className={`flex-shrink-0 px-7 py-3 rounded-full text-xs font-black transition-all snap-center ${tempCat === c.id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}>{c.name}</button>
                    ))}
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent pointer-events-none`} />
                </div>
              </div>

              {/* Города (Чипсы) */}
              <div className="space-y-2">
                <p className="text-[10px] font-black opacity-30 ml-2 uppercase">ქალაქი</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(city => (
                    <button key={city} onClick={() => setTempLocation(city)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${tempLocation === city ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 opacity-50'}`}>{city}</button>
                  ))}
                </div>
              </div>

              {/* Цена + Плавный ИИ */}
              <div className="space-y-4">
                <input 
                  type="number" placeholder="ფასი (₾)" 
                  className={`w-full p-6 rounded-[2rem] text-3xl font-black outline-none border-2 border-transparent focus:border-blue-500 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} 
                  value={tempPrice} 
                  onChange={(e) => { setTempPrice(e.target.value); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 400); }} 
                />

                <div className={`p-6 rounded-[2.5rem] text-white shadow-xl transition-all duration-700 ease-in-out transform ${tempPrice && tempTitle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${aiVerdict.status === 'error' ? 'bg-red-500 shadow-red-500/20' : aiVerdict.status === 'warning' ? 'bg-orange-500' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl transition-all ${isAnalyzing ? 'animate-bounce' : ''}`}>🤖</span>
                    <div>
                      <p className="text-[9px] font-black uppercase opacity-70 tracking-widest">GAVITO AI ENGINE</p>
                      <p className="text-sm font-bold">{isAnalyzing ? "ანალიზი..." : aiVerdict.text}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}

      {/* ГЛОБАЛЬНЫЕ СТИЛИ (Скроллбары) */}
      <style jsx global>{`
        /* Скроллбары окна (Внутри границ) */
        .modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin: 20px;
        }
        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 99px;
        }

        /* Скроллбары категорий (Горизонтальные) */
        .custom-scrollbar::-webkit-scrollbar { height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: rgba(0,0,0,0.05); 
          border-radius: 99px; 
          margin: 0 40px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #3b82f6; 
          border-radius: 99px; 
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
