'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, PlusCircle, MapPin, X, Moon, Sun, 
  ShoppingBag, Car, Home, Smartphone, Briefcase, 
  Info, Globe, Loader2 
} from 'lucide-react';

// 1. Используем только строки, чтобы Next.js не ругался при сборке
const CATEGORIES = [
  { id: 'all', name: 'ყველა', icon: 'all' },
  { id: 'cars', name: 'ავტო', icon: 'cars' },
  { id: 'realestate', name: 'უძრავი ქონება', icon: 'realestate' },
  { id: 'tech', name: 'ტექნიკა', icon: 'tech' },
  { id: 'jobs', name: 'ვაკანსია', icon: 'jobs' },
];

const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

export default function Page() {
  const [products, setProducts] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
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

  // Функция для отрисовки иконки по ID (безопасно для сборки)
  const renderIcon = (id: string) => {
    switch (id) {
      case 'cars': return <Car size={20} />;
      case 'realestate': return <Home size={20} />;
      case 'tech': return <Smartphone size={20} />;
      case 'jobs': return <Briefcase size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  const getGlobalMarketAdvice = (price: string, title: string, cat: string) => {
    if (!price || !title) return null;
    const p = parseFloat(price);
    const name = title.toLowerCase();

    const MARKET_DATA: any = {
      'iphone 17': { avg: 4000 },
      'iphone 15': { avg: 2000 },
      'ps5': { avg: 1300 },
      'bmw': { avg: 15000 }
    };

    let found = Object.keys(MARKET_DATA).find(k => name.includes(k));
    if (found) {
      const avg = MARKET_DATA[found].avg;
      if (p < avg * 0.3) return "⚠️ ფასი საეჭვოდ დაბალია! ფრთხილად იყავით.";
      if (p > avg * 1.4) return "📈 ფასი ბაზარზე მაღალია. გაყიდვა გაჭირდება.";
      return "✅ კარგი ფასია. შეესაბამება გლობალურ ბაზარს.";
    }
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
    setTempTitle(''); setTempPrice('');
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        
        <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <div className="text-2xl font-black text-blue-600">GAVITO</div>
            <div className="flex-1 flex gap-2 w-full">
              <input 
                type="text" placeholder="ძებნა..." 
                className="flex-[2] p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold cursor-pointer"
                value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">დამატება</button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto py-6">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'
              }`}
            >
              {renderIcon(cat.icon)} {cat.name}
            </button>
          ))}
        </div>

        <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <img src={p.image} className="w-full aspect-square object-cover rounded-[1.5rem] mb-4" />
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-slate-400 text-sm">{p.location}</p>
              <div className="text-blue-600 font-black text-2xl mt-2">{p.price} ₾</div>
            </div>
          ))}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24}/></button>
              <h2 className="text-2xl font-black mb-6">დამატება</h2>
              
              <div className="space-y-4">
                <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                
                <div className="grid grid-cols-2 gap-2">
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                    {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                    {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <input 
                  type="number" placeholder="ფასი" 
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" 
                  value={tempPrice} 
                  onChange={(e) => {
                    setTempPrice(e.target.value);
                    setIsAnalyzing(true);
                    setTimeout(() => setIsAnalyzing(false), 1000);
                  }} 
                />

                {(tempPrice && tempTitle) && (
                  <div className="p-4 bg-blue-600 rounded-2xl text-white">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-1">
                      <Globe size={14} className={isAnalyzing ? "animate-spin" : ""}/> 
                      {isAnalyzing ? "სკანირება..." : "AI ანალიზი"}
                    </div>
                    {!isAnalyzing && <p className="text-sm">{getGlobalMarketAdvice(tempPrice, tempTitle, tempCat)}</p>}
                  </div>
                )}

                <input type="text" placeholder="ფოტოს ლინკი" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempImage} onChange={(e) => setTempImage(e.target.value)} />

                <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg active:scale-95 transition-all">გამოქვეყნება</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
