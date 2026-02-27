'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, PlusCircle, MapPin, X, Moon, Sun, ShoppingBag, Car, Home, Smartphone, Briefcase, Info, Globe, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'ყველა', icon: <ShoppingBag size={20}/> },
  { id: 'cars', name: 'ავტო', icon: <Car size={20}/> },
  { id: 'realestate', name: 'უძრავი ქონება', icon: <Home size={20}/> },
  { id: 'tech', name: 'ტექნიკა', icon: <Smartphone size={20}/> },
  { id: 'jobs', name: 'ვაკანსია', icon: <Briefcase size={20}/> },
];

const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

export default function Page() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Поля формы
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [tempCat, setTempCat] = useState('tech');
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Состояние "сканирования"

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  // Эмуляция Глобального ИИ-помощника
  const getGlobalMarketAdvice = (price, title, cat) => {
    if (!price || !title) return null;
    const p = parseFloat(price);
    
    // Логика сравнения (имитация доступа к внешним данным)
    if (cat === 'tech') {
      if (p > 3000) return "მაღაზიებში ახალი ღირს ~3200₾. მეორადი ბაზრისთვის ეს ფასი მაღალია.";
      return "შესანიშნავი ფასია! მაღაზიებთან შედარებით 20%-ით იაფია.";
    }
    if (cat === 'cars') {
      if (p < 5000) return "ფასი საეჭვოდ დაბალია სხვა საიტებთან (MyAuto) შედარებით. შეამოწმეთ ისტორია.";
      return "ბაზრის საშუალო ფასია. მსგავსი მანქანები სხვაგან 5-10%-ით ძვირია.";
    }
    return "ფასი შემოწმებულია გლობალურ ბაზარზე: ოპტიმალურია.";
  };

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    await supabase.from('products').insert([{ 
      title: tempTitle, price: parseFloat(tempPrice), location: tempLocation, category: tempCat, image: '📦'
    }]);
    setIsModalOpen(false);
    fetchProducts();
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ყველა ქალაქი' || p.location === selectedCity;
    return matchesSearch && matchesCat && matchesCity;
  });

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
        
        {/* HEADER */}
        <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-black text-blue-600">GAVITO</div>
            <div className="flex flex-1 w-full max-w-2xl gap-2">
              <input 
                type="text" placeholder="ძებნა..." 
                className="flex-[2] pl-4 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-all">
               დამატება
            </button>
          </div>
        </header>

        {/* FEED */}
        <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border dark:border-slate-800 shadow-sm">
              <div className="aspect-square mb-4 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-5xl">📦</div>
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-slate-400 text-sm flex items-center gap-1"><MapPin size={14}/> {p.location}</p>
              <div className="text-blue-600 font-black text-2xl mt-2">{p.price} ₾</div>
            </div>
          ))}
        </main>

        {/* MODAL WITH AI AGENT */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24}/></button>
              <h2 className="text-2xl font-black mb-6 uppercase">ახალი განცხადება</h2>
              
              <div className="space-y-4">
                <input type="text" placeholder="რა ნივთს ყიდით?" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" 
                  value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                    {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                    {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <input type="number" placeholder="ფასი (₾)" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" 
                    value={tempPrice} onChange={(e) => {
                      setTempPrice(e.target.value);
                      setIsAnalyzing(true);
                      setTimeout(() => setIsAnalyzing(false), 1500); // Имитация поиска в сети
                    }} 
                  />
                </div>

                {/* AI AGENT BOX */}
                {(tempPrice && tempTitle) && (
                  <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-2 mb-2 text-blue-100 text-xs font-bold uppercase tracking-widest">
                      <Globe size={14} className={isAnalyzing ? "animate-spin" : ""}/>
                      {isAnalyzing ? "ბაზრის სკანირება..." : "გლობალური AI ანალიზი"}
                    </div>
                    {isAnalyzing ? (
                      <div className="h-10 flex items-center justify-center"><Loader2 className="animate-spin opacity-50"/></div>
                    ) : (
                      <p className="text-sm font-medium leading-relaxed">
                        {getGlobalMarketAdvice(tempPrice, tempTitle, tempCat)}
                      </p>
                    )}
                  </div>
                )}

                <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all">გამოქვეყნება</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
