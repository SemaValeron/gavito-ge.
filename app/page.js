'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, PlusCircle, MapPin, X, Moon, Sun, ShoppingBag, Car, Home, Smartphone, Briefcase, Info } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'ყველა', icon: <ShoppingBag size={20}/> },
  { id: 'cars', name: 'ავტო', icon: <Car size={20}/> },
  { id: 'realestate', name: 'უძრავი ქონება', icon: <Home size={20}/> },
  { id: 'tech', name: 'ტექნიკა', icon: <Smartphone size={20}/> },
  { id: 'jobs', name: 'ვაკანსია', icon: <Briefcase size={20}/> },
];

const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

export default function Page() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Поля формы
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
      image: tempImage || 'https://via.placeholder.com/300' // если фото нет, ставим заглушку
    }]);

    setIsModalOpen(false);
    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setTempTitle(''); setTempPrice(''); setTempLocation('თბილისი'); setTempImage('');
  };

  // ИИ Помощник по ценам (Логика)
  const getAiAdvice = (price) => {
    if (!price) return null;
    const p = parseFloat(price);
    if (p > 5000) return "ეს არის პრემიუმ სეგმენტი. დარწმუნდით, რომ ფოტოები ხარისხიანია.";
    if (p < 50) return "ფასი ძალიან დაბალია, რაც სწრაფ გაყიდვას შეუწყობს ხელს.";
    return "ფასი ოპტიმალურია თქვენი კატეგორიისთვის.";
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
        
        {/* HEADER */}
        <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-black text-blue-600 flex items-center gap-2 tracking-tighter">GAVITO</div>
            
            {/* SEARCH */}
            <div className="flex-1 max-w-xl w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                type="text" 
                placeholder="მოძებნე ნივთი, ავტო, უძრავი ქონება..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                <PlusCircle size={20}/> დამატება
              </button>
            </div>
          </div>
        </header>

        {/* CATEGORIES BAR */}
        <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto no-scrollbar py-6">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-white dark:bg-slate-900 border dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* MAIN FEED */}
        <main className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="group bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="aspect-square mb-4 overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800">
                  <img src={p.image || 'https://via.placeholder.com/300'} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="px-2 pb-2">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <MapPin size={14}/> {p.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-blue-600 font-black text-2xl">{p.price} ₾</div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider">{p.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 opacity-50">ვერაფერი მოიძებნა...</div>
          )}
        </main>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors"><X size={28}/></button>
              
              <h2 className="text-3xl font-black mb-8 tracking-tighter">განცხადების დამატება</h2>
              
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs font-black uppercase ml-2 mb-2 block opacity-50">სათაური</label>
                  <input type="text" placeholder="მაგ: iPhone 15 Pro..." className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-black uppercase ml-2 mb-2 block opacity-50">კატეგორია</label>
                    <select className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none cursor-pointer" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                      {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  {/* City */}
                  <div>
                    <label className="text-xs font-black uppercase ml-2 mb-2 block opacity-50">ქალაქი</label>
                    <select className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none cursor-pointer" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Price & AI */}
                <div>
                  <label className="text-xs font-black uppercase ml-2 mb-2 block opacity-50">ფასი (₾)</label>
                  <input type="number" placeholder="0.00" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                  {tempPrice && (
                    <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                      <Info size={18} className="shrink-0"/>
                      <b>AI რჩევა:</b> {getAiAdvice(tempPrice)}
                    </div>
                  )}
                </div>

                {/* Image Link */}
                <div>
                  <label className="text-xs font-black uppercase ml-2 mb-2 block opacity-50">ფოტოს ლინკი</label>
                  <input type="text" placeholder="https://..." className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all" value={tempImage} onChange={(e) => setTempImage(e.target.value)} />
                </div>

                <button onClick={handlePublish} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 mt-4">გამოქვეყნება</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
