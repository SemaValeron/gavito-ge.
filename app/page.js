'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
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
    const timer = setInterval(() => setCurrentAd(p => (p + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const aiVerdict = useMemo(() => {
    if (!tempPrice || !tempTitle) return { text: "", status: "idle" };
    const price = parseFloat(tempPrice);
    if (price > 10000) return { text: `❌ ფასი ძალიან მაღალია!`, status: "error" };
    return { text: "✅ ოპტიმალური ფასია", status: "success" };
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
    <div className={`min-h-screen transition-all duration-700 ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Header */}
      <header className="p-4 sticky top-0 z-50 border-b backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-[3.5rem] relative ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
            
            {/* ШАПКА С ЭФФЕКТОМ ЖИДКОГО СТЕКЛА */}
            <div className={`sticky top-0 z-20 p-8 pb-4 backdrop-blur-xl ${darkMode ? 'bg-slate-900/60' : 'bg-white/60'} border-b border-transparent flex items-center justify-between`}>
              <h2 className="text-3xl font-black uppercase tracking-tighter">განთავსება</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 opacity-50 hover:opacity-100 transition-all">✕</button>
            </div>

            {/* ОСНОВНОЙ КОНТЕНТ СО СКРЫТЫМ СКРОЛЛБАРОМ ВНУТРИ РАМОК */}
            <div className="flex-1 overflow-y-auto modal-scroll p-8 pt-4 space-y-6">
              
              {/* Фото */}
              <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-800 hover:border-blue-500 transition-colors">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-4xl opacity-30">📸</span>}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
              </label>

              <input type="text" placeholder="სათაური" className={`w-full p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              {/* Категории (Живой скролл) */}
              <div className="relative">
                <p className="text-[10px] font-black opacity-30 ml-2 mb-2 uppercase tracking-widest">კატეგორია</p>
                <div className="relative flex items-center">
                  <div className={`absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent pointer-events-none`} />
                  <div 
                    ref={scrollRef} 
                    className="flex gap-3 overflow-x-auto py-4 px-10 custom-scrollbar scroll-smooth snap-x touch-pan-x"
                  >
                    {CATEGORIES.slice(1).map(c => (
                      <button key={c.id} onClick={(e) => handleCategorySelect(e, c.id)} className={`flex-shrink-0 px-7 py-3 rounded-full text-xs font-black transition-all snap-center ${tempCat === c.id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}>{c.name}</button>
                    ))}
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l ${darkMode ? 'from-slate-900' : 'from-white'} to-transparent pointer-events-none`} />
                </div>
              </div>

              {/* Города */}
              <div className="flex flex-wrap gap-2">
                {CITIES.map(city => (
                  <button key={city} onClick={() => setTempLocation(city)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${tempLocation === city ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 opacity-50'}`}>{city}</button>
                ))}
              </div>

              {/* Цена + ИИ */}
              <div className="space-y-4">
                <input type="number" placeholder="ფასი (₾)" className={`w-full p-6 rounded-[2rem] text-3xl font-black outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} value={tempPrice} onChange={(e) => { setTempPrice(e.target.value); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 400); }} />
                
                <div className={`p-6 rounded-[2.5rem] text-white shadow-xl transition-all duration-700 ${tempPrice && tempTitle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${aiVerdict.status === 'error' ? 'bg-red-500 shadow-red-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl transition-all ${isAnalyzing ? 'animate-pulse' : ''}`}>🤖</span>
                    <p className="text-sm font-bold">{isAnalyzing ? "ანალიზი..." : aiVerdict.text}</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all">განთავსება</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Убираем выход скролла за границы модалки */
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 transparent;
        }
        
        /* Хромиум скроллбар (скругленный) */
        .modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin-top: 10px;
          margin-bottom: 30px;
        }
        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 99px;
        }

        /* Горизонтальный скролл (категории) */
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: rgba(0,0,0,0.05); 
          border-radius: 99px; 
          margin: 0 50px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #3b82f6; 
          border-radius: 99px; 
        }
        
        /* Плавность появления */
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
