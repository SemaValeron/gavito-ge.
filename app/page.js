'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, PlusCircle, MapPin, X, Moon, Sun, ShoppingBag, Car, Home, Smartphone, Briefcase, Info, Navigation } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'ყველა', icon: <ShoppingBag size={20}/> },
  { id: 'cars', name: 'ავტო', icon: <Car size={20}/> },
  { id: 'realestate', name: 'უძრავი ქონება', icon: <Home size={20}/> },
  { id: 'tech', name: 'ტექნიკა', icon: <Smartphone size={20}/> },
  { id: 'jobs', name: 'ვაკანსია', icon: <Briefcase size={20}/> },
];

const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი'];

export default function Page() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი'); // Новый фильтр по городам
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [tempCat, setTempCat] = useState('tech');
  const [tempImage, setTempImage] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    
    await supabase.from('products').insert([{ 
      title: tempTitle, 
      price: parseFloat(tempPrice), 
      location: tempLocation, 
      category: tempCat,
      image: tempImage || 'https://via.placeholder.com/300'
    }]);

    setIsModalOpen(false);
    setTempTitle(''); setTempPrice(''); setTempImage('');
    fetchProducts();
  };

  const getAiAdvice = (price) => {
    if (!price) return null;
    const p = parseFloat(price);
    if (p > 5000) return "ეს არის პრემიუმ სეგმენტი. დარწმუნდით, რომ ფოტოები ხარისხიანია.";
    if (p < 50) return "ფასი ძალიან დაბალია, რაც სწრაფ გაყიდვას შეუწყობს ხელს.";
    return "ფასი ოპტიმალურია თქვენი კატეგორიისთვის.";
  };

  // ОБНОВЛЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ
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
            <div className="text-2xl font-black text-blue-600 flex items-center gap-2">GAVITO</div>
            
            <div className="flex flex-1 w-full max-w-3xl gap-2">
              {/* Поиск по названию */}
              <div className="flex-[2] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  type="text" 
                  placeholder="ძებნა..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* НОВЫЙ СЕЛЕКТ ГОРОДА В ШАПКЕ */}
              <div className="flex-1 relative hidden sm:block">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18}/>
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 appearance-none cursor-pointer font-bold"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all">
                <PlusCircle size={20}/> დამატება
              </button>
            </div>
          </div>
        </header>

        {/* CATEGORIES */}
        <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto no-scrollbar py-6">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* FEED */}
        <main className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="group bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-square mb-4 overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800">
                  <img src={p.image || 'https://via.placeholder.com/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="px-2">
                  <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <MapPin size={14}/> {p.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-blue-600 font-black text-2xl">{p.price} ₾</div>
                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold uppercase">{p.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24}/></button>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">განცხადების დამატება</h2>
              
              <div className="space-y-4">
                <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                
                <div className="grid grid-cols-2 gap-3">
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                    {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                    {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <input type="number" placeholder="ფასი" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                
                {tempPrice && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex gap-2 text-xs text-blue-700 dark:text-blue-300">
                    <Info size={16} className="shrink-0"/>
                    <span><b>AI:</b> {getAiAdvice(tempPrice)}</span>
                  </div>
                )}

                <input type="text" placeholder="ფოტოს ლინკი (URL)" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempImage} onChange={(e) => setTempImage(e.target.value)} />

                <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all">გამოქვეყნება</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
