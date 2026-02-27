'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, PlusCircle, MapPin, X, Moon, Sun, 
  ShoppingBag, Car, Home, Smartphone, Briefcase, 
  Info, Globe, Loader2 
} from 'lucide-react';

// 1. Упрощенный массив данных (без JSX внутри)
const CATEGORY_DATA = [
  { id: 'all', name: 'ყველა', iconId: 'all' },
  { id: 'cars', name: 'ავტო', iconId: 'cars' },
  { id: 'realestate', name: 'უძრავი ქონება', iconId: 'realestate' },
  { id: 'tech', name: 'ტექნიკა', iconId: 'tech' },
  { id: 'jobs', name: 'ვაკანსია', iconId: 'jobs' },
];

const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

// 2. Функция для безопасного рендера иконок
const RenderIcon = ({ id, size = 20 }: { id: string, size?: number }) => {
  switch (id) {
    case 'cars': return <Car size={size} />;
    case 'realestate': return <Home size={size} />;
    case 'tech': return <Smartphone size={size} />;
    case 'jobs': return <Briefcase size={size} />;
    default: return <ShoppingBag size={size} />;
  }
};

export default function Page() {
  const [products, setProducts] = useState<any[]>([]); 
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
  const [tempImage, setTempImage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  // Умный ИИ Помощник
  const getGlobalMarketAdvice = (price: string, title: string, cat: string) => {
    if (!price || !title) return null;
    const p = parseFloat(price);
    const name = title.toLowerCase();

    const MARKET_DATA: any = {
      'iphone 17 pro max': { new: 4500, used: 3800 },
      'iphone 15': { new: 2200, used: 1600 },
      'macbook': { new: 3500, used: 2500 },
      'playstation 5': { new: 1500, used: 1100 },
      'bmw': { used_avg: 15000 }
    };

    let itemData = null;
    for (let key in MARKET_DATA) {
      if (name.includes(key)) {
        itemData = MARKET_DATA[key];
        break;
      }
    }

    if (itemData) {
      const marketPrice = itemData.new || itemData.used_avg;
      if (p < marketPrice * 0.2) return `⚠️ ფასი საეჭვოდ დაბალია! ბაზარზე ეს ნივთი ~${marketPrice}₾ ღირს.`;
      if (p > marketPrice * 1.3) return `📈 ფასი მაღალია. მაღაზიაში ახალი ~${marketPrice}₾ ღირს.`;
      return `✅ იდეალური ფასია! შეესაბამება გლობალურ ბაზარს.`;
    }

    if (cat === 'tech' && p < 10) return "⚠️ ფასი არარეალურია ტექნიკისთვის.";
    return "🔍 ბაზრის ანალიზი: ფასი ოპტიმალურია.";
  };

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
    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setTempTitle(''); setTempPrice(''); setTempLocation('თბილისი'); setTempImage('');
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
            <div className="text-2xl font-black text-blue-600 tracking-tighter">GAVITO</div>
            
            <div className="flex flex-1 w-full max-w-2xl gap-2">
              <div className="flex-[2] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  type="text" placeholder="ძებნა..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 transition-all">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                <PlusCircle size={20}/> დამატება
              </button>
            </div>
          </div>
        </header>

        {/* CATEGORIES BAR */}
        <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto no-scrollbar py-6">
          {CATEGORY_DATA.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              <RenderIcon id={cat.iconId} /> {cat.name}
            </button>
          ))}
        </div>

        {/* MAIN FEED */}
        <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="group bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square mb-4 overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800">
                <img src={p.image || 'https://via.placeholder.com/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="px-2">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{p.title}</h3>
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
        </main>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">განცხადების დამატება</h2>
              
              <div className="space-y-4">
                <input type="text" placeholder="რა ნივთს ყიდით?" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                
                <div className="grid grid-cols-2 gap-3">
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none cursor-pointer" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                    {CATEGORY_DATA.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none cursor-pointer" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                    {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <input type="number" placeholder="ფასი (₾)" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all" 
                    value={tempPrice} onChange={(e) => {
                      setTempPrice(e.target.value);
                      setIsAnalyzing(true);
                      setTimeout(() => setIsAnalyzing(false), 800);
                    }} 
                  />
                </div>

                {/* AI AGENT BOX */}
                {(tempPrice && tempTitle) && (
                  <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-2 mb-2 text-blue-100 text-[10px] font-black uppercase tracking-widest">
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

                <input type="text" placeholder="ფოტოს ლინკი (URL)" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all" value={tempImage} onChange={(e) => setTempImage(e.target.value)} />

                <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all mt-2">გამოქვეყნება</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
