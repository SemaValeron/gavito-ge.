'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, MapPin, Sparkles, Car, Home, Laptop, Dog, X, Heart, Moon, Sun, ChevronDown } from 'lucide-react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedCity, setSelectedCity] = useState('ყველა საქართველო');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cities = ['ყველა საქართველო', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ზუგდიდი', 'ფოთი', 'გორი'];

  const allProducts = [
    { id: 1, title: 'iPhone 15 Pro Max', price: '3200', cat: 'ელექტრონიკა', loc: 'თბილისი', img: '📱' },
    { id: 2, title: 'Toyota Prius 2018', price: '12500', cat: 'ავტომობილები', loc: 'ბათუმი', img: '🚗' },
    { id: 3, title: 'ბინა ვაკეში', price: '150000', cat: 'უძრავი ქონება', loc: 'თბილისი', img: '🏠' },
    { id: 4, title: 'MacBook Air M2', price: '2800', cat: 'ელექტრონიკა', loc: 'ქუთაისი', img: '💻' },
    { id: 5, title: 'BMW E60 M5', price: '18000', cat: 'ავტომობილები', loc: 'თბილისი', img: '🏎️' },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const analyzePrice = () => {
    if (!tempPrice) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const price = parseFloat(tempPrice);
      if (price > 3500 && tempTitle.toLowerCase().includes('iphone')) {
        setAiAnalysis({ status: 'ძვირია', color: 'text-red-500', msg: 'საშუალო ფასი 3200 ₾' });
      } else {
        setAiAnalysis({ status: 'კარგი ფასი', color: 'text-green-600', msg: 'შეესაბამება ბაზარს' });
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const filtered = allProducts.filter(p => 
    (selectedCategory === 'ყველა' || p.cat === selectedCategory) &&
    (selectedCity === 'ყველა საქართველო' || p.loc === selectedCity) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-sans">
        
        {/* HEADER */}
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer" onClick={() => {setSelectedCategory('ყველა'); setSelectedCity('ყველა საქართველო');}}>GAVITO</div>
            
            {/* ВЫБОР ГОРОДА */}
            <div className="relative hidden lg:block">
              <button 
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <MapPin size={16} className="text-blue-500" />
                {selectedCity}
                <ChevronDown size={14} />
              </button>
              
              {isCityOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-2xl rounded-2xl p-2 z-[60] animate-in fade-in zoom-in duration-200">
                  {cities.map(city => (
                    <div 
                      key={city}
                      onClick={() => {setSelectedCity(city); setIsCityOpen(false);}}
                      className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg cursor-pointer text-sm font-medium transition-colors"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 max-w-md relative hidden md:block">
              <input 
                type="text" 
                placeholder="მოძებნე..." 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 rounded-2xl px-10 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-yellow-400 transition-all active:scale-90"
              >
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm">
                <PlusCircle size={20}/> <span className="hidden sm:inline">დამატება</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 py-8">
          <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar">
            {['ავტომობილები', 'უძრავი ქონება', 'ელექტრონიკა', 'ცხოველები'].map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedCategory(c === selectedCategory ? 'ყველა' : c)} 
                className={`px-5 py-2.5 rounded-2xl border-2 transition-all font-bold whitespace-nowrap ${selectedCategory === c ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-blue-400'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p, index) => (
              <div 
                key={p.id} 
                className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{p.img}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-125 ${favorites.includes(p.id) ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-slate-700/80 text-slate-400'}`}
                  >
                    <Heart size={18} fill={favorites.includes(p.id) ? "currentColor" : "none"}/>
                  </button>
                </div>
                
                <div className="px-2">
                  <h3 className="font-bold text-lg leading-tight mb-1">{p.title}</h3>
                  <div className="text-blue-600 dark:text-blue-400 font-black text-2xl mb-3">{p.price} ₾</div>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={14} className="text-blue-500"/> {p.loc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => {setIsModalOpen(false); setAiAnalysis(null);}} className="absolute top-8 right-8 text-slate-400 dark:hover:text-white transition-colors"><X size={24}/></button>
              
              <h2 className="text-3xl font-black mb-8 flex items-center gap-2">დამატება <Sparkles className="text-blue-500" size={24}/></h2>
              
              <div className="space-y-5">
                <input 
                  type="text" 
                  placeholder="სათაური" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold transition-all"
                  onChange={(e) => setTempTitle(e.target.value)}
                />
                
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="ფასი" 
                    className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-xl text-blue-600 transition-all" 
                    onChange={(e) => setTempPrice(e.target.value)}
                  />
                  <button onClick={analyzePrice} className="bg-slate-900 dark:bg-blue-600 text-white px-5 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                    {isAnalyzing ? "..." : <Sparkles size={20}/>}
                  </button>
                </div>

                {aiAnalysis && (
                  <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl animate-in slide-in-from-top-2">
                    <div className={`font-black ${aiAnalysis.color}`}>{aiAnalysis.status}</div>
                    <div className="text-sm opacity-70 font-medium">{aiAnalysis.msg}</div>
                  </div>
                )}
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                  გამოქვეყნება
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
