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
  
  // Рекламный блок
  const [currentAd, setCurrentAd] = useState(0);
  const adRef = useRef(null);
  const timerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ADS = [
    { text: "GAVITO — შენი საიმედო მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "ენდე ჩვენს AI შემფასებელს — გაიგე რეალური ფასი", img: "🤖", color: "from-purple-600 to-pink-600" },
    { text: "გაყიდე სწრაფად და მარტივად ჩვენთან", img: "⚡", color: "from-orange-500 to-red-600" },
    { text: "საუკეთესო შემოთავაზებები მთელ საქართველოში", img: "🇬🇪", color: "from-emerald-500 to-teal-700" },
    { text: "ჭკვიანი ძებნა — იპოვე ის, რაც გჭირდება", img: "🔍", color: "from-sky-500 to-blue-700" },
    { text: "GAVITO-ზე განთავსება სრულიად უფასოა", img: "💎", color: "from-amber-500 to-orange-600" },
    { text: "შენი უსაფრთხოება ჩვენი პრიორიტეტია", img: "🛡️", color: "from-violet-600 to-purple-800" },
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

  const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი', 'მცხეთა'];

  // Исправленный таймер с использованием IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (adRef.current) observer.observe(adRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      timerRef.current = setInterval(() => {
        setCurrentAd((prev) => (prev + 1) % ADS.length);
      }, 5000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isIntersecting]);

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

  const filtered = products.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ყველა ქალაქი' || p.location === selectedCity;
    return matchesSearch && matchesCat && matchesCity;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      <header className="bg-white dark:bg-[#1e293b] border-b dark:border-slate-800 p-4 sticky top-0 z-50 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter cursor-pointer" onClick={() => setSelectedCategory('all')}>GAVITO</div>
          <div className="flex-1 flex gap-2 w-full">
            <input 
              type="text" placeholder="მოძებნეთ ყველაფერი..." 
              className="flex-[2] p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 dark:text-white transition-all text-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold cursor-pointer dark:text-white transition-all text-sm"
              value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xl transition-all">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">განცხადება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Рекламный островок с бесшовным переходом */}
        <div ref={adRef} className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[3rem] shadow-2xl bg-slate-200 dark:bg-slate-800">
          {ADS.map((ad, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full flex items-center p-8 sm:p-12 bg-gradient-to-r ${ad.color} transition-all duration-1000 ease-in-out ${
                index === currentAd ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
              }`}
            >
              <div className="flex items-center gap-6 sm:gap-10 w-full">
                <div className={`text-6xl sm:text-8xl drop-shadow-2xl transition-all duration-700 ${index === currentAd ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {ad.img}
                </div>
                <div className={`text-2xl sm:text-5xl font-black text-white leading-tight drop-shadow-lg max-w-2xl transition-all duration-700 delay-100 ${index === currentAd ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                  {ad.text}
                </div>
              </div>
              
              <div className="absolute top-6 right-8 text-white/40 font-black text-2xl tracking-tighter select-none">
                GAVITO
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {ADS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentAd ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-black mb-6 opacity-80 uppercase tracking-widest text-sm dark:text-blue-400">კატეგორიები</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative flex flex-col items-center p-5 rounded-[2.5rem] transition-all duration-500 ${
                  selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-xl scale-105 ring-4 ring-blue-500/20' 
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <div className={`w-14 h-14 mb-3 rounded-[1.2rem] bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  {cat.img}
                </div>
                <span className="text-[10px] font-black text-center leading-tight uppercase tracking-tighter opacity-90">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <h2 className="text-xl font-black mb-6 opacity-80 uppercase tracking-widest text-sm dark:text-blue-400">განცხადებები</h2>
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((p) => (
            <div key={p.id} className="group bg-white dark:bg-slate-900 p-5 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="relative overflow-hidden w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-[2rem] mb-5 flex items-center justify-center text-6xl group-hover:scale-[0.98] transition-transform duration-500">
                📦
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm">{p.location}</div>
              </div>
              <h3 className="font-bold text-lg mb-1 dark:text-white truncate px-2">{p.title}</h3>
              <div className="flex items-center justify-between mt-5 px-2">
                <div className="text-blue-600 dark:text-blue-400 font-black text-2xl tracking-tighter">{p.price} ₾</div>
                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900 transition-all active:scale-90">💙</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Modal (упрощенный) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3.5rem] p-10 relative shadow-2xl animate-in fade-in zoom-in duration-500">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-400 hover:text-black dark:hover:text-white transition-colors text-xl">✕</button>
            <h2 className="text-3xl font-black mb-10 tracking-tighter dark:text-white uppercase">დამატება</h2>
            <div className="space-y-5">
              <input type="text" placeholder="სათაური" className="w-full p-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold" />
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl active:scale-95 transition-all mt-6">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

