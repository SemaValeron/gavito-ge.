'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [tempCat, setTempCat] = useState('tech');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const CATEGORIES = [
    { id: 'all', name: 'ყველა', icon: '🛍️' },
    { id: 'cars', name: 'ავტო', icon: '🚗' },
    { id: 'realestate', name: 'უძრავი ქონება', icon: '🏠' },
    { id: 'tech', name: 'ტექნიკა', icon: '📱' },
    { id: 'home', name: 'სახლი და ბაღი', icon: '🌿' },
    { id: 'fashion', name: 'ტანსაცმელი', icon: '👕' },
    { id: 'beauty', name: 'სილამაზე', icon: '✨' },
    { id: 'sport', name: 'სპორტი', icon: '⚽' },
    { id: 'kids', name: 'ყველაფერი ბავშვებისთვის', icon: '🧸' },
  ];

  const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი', 'მცხეთა', 'ქობულეთი'];

  const MARKET_DATA = {
    'iphone 17': 4500,
    'iphone 16': 3500,
    'iphone 15': 2200,
    'ps5': 1400,
    'macbook': 4000,
    'airpods': 600
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const getAiAdvice = (price, title) => {
    if (!price || !title) return null;
    const p = parseFloat(price);
    const name = title.toLowerCase();
    let foundKey = Object.keys(MARKET_DATA).find(k => name.includes(k));
    
    if (foundKey) {
      const marketPrice = MARKET_DATA[foundKey];
      if (p < marketPrice * 0.4) return "⚠️ ფასი საეჭვოდ დაბალია ბაზართან შედარებით!";
      if (p > marketPrice * 1.3) return "📈 ფასი მაღალია, სხვაგან უფრო იაფად იყიდება.";
      return "✅ კარგი ფასია, შეესაბამება საბაზრო ღირებულებას.";
    }
    return "🔍 ფასი მისაღებია მოცემული კატეგორიისთვის.";
  };

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    await supabase.from('products').insert([{ 
      title: tempTitle, 
      price: parseFloat(tempPrice), 
      location: tempLocation, 
      category: tempCat, 
      image: 'https://via.placeholder.com/300'
    }]);
    setIsModalOpen(false);
    setTempTitle(''); setTempPrice('');
    fetchProducts();
  };

  const filtered = products.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ყველა ქალაქი' || p.location === selectedCity;
    return matchesSearch && matchesCat && matchesCity;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-50 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">GAVITO</div>
          <div className="flex-1 flex gap-2 w-full">
            <input 
              type="text" placeholder="ძებნა..." 
              className="flex-[2] p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 dark:text-white transition-all"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold cursor-pointer dark:text-white transition-all"
              value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xl"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">დამატება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto py-6 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap ${
              selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500'
            }`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-500">
            <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] mb-4 flex items-center justify-center text-4xl">📦</div>
            <h3 className="font-bold text-lg mb-1 dark:text-white">{p.title}</h3>
            <p className="text-slate-400 text-sm mb-3">📍 {p.location}</p>
            <div className="text-blue-600 dark:text-blue-400 font-black text-2xl">{p.price} ₾</div>
          </div>
        ))}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl transition-colors duration-500">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 font-bold text-slate-400 hover:text-black dark:hover:text-white transition-colors">✕</button>
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter dark:text-white">ახალი განცხადება</h2>
            
            <div className="space-y-4">
              <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-500/20" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              <div className="grid grid-cols-2 gap-2">
                <select className="p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                  {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <input 
                type="number" placeholder="ფასი (₾)" 
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none" 
                value={tempPrice} 
                onChange={(e) => {
                  setTempPrice(e.target.value);
                  setIsAnalyzing(true);
                  setTimeout(() => setIsAnalyzing(false), 600);
                }} 
              />

              {(tempPrice && tempTitle) && (
                <div className="p-4 bg-blue-600 dark:bg-blue-700 rounded-[1.5rem] text-white animate-in fade-in zoom-in duration-300">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                    {isAnalyzing ? "🌐 ბაზრის ანალიზი..." : "🤖 AI ასისტენტი"}
                  </div>
                  {!isAnalyzing && <p className="text-sm font-medium">{getAiAdvice(tempPrice, tempTitle)}</p>}
                </div>
              )}

              <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
