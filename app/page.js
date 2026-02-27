'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as Icons from 'lucide-react';

// 1. В данных ТОЛЬКО строки. Никаких объектов и импортов.
const CATEGORIES = [
  { id: 'all', name: 'ყველა' },
  { id: 'cars', name: 'ავტო' },
  { id: 'realestate', name: 'უძრავი ქონება' },
  { id: 'tech', name: 'ტექნიკა' },
  { id: 'jobs', name: 'ვაკანსია' },
];

const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

export default function Page() {
  const [products, setProducts] = useState<any[]>([]); 
  const [mounted, setMounted] = useState(false); // Проверка на загрузку клиента
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [tempCat, setTempCat] = useState('tech');
  const [tempImage, setTempImage] = useState('');

  // 2. Ждем, пока компонент "сядет" в браузер
  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  // 3. Безопасный рендер иконок (только на клиенте)
  const getIcon = (id: string) => {
    if (!mounted) return null; // На сервере иконки не рисуем вообще
    switch (id) {
      case 'cars': return <Icons.Car size={20} />;
      case 'realestate': return <Icons.Home size={20} />;
      case 'tech': return <Icons.Smartphone size={20} />;
      case 'jobs': return <Icons.Briefcase size={20} />;
      default: return <Icons.ShoppingBag size={20} />;
    }
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
    fetchProducts();
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ყველა ქალაქი' || p.location === selectedCity;
    return matchesSearch && matchesCat && matchesCity;
  });

  // Если сервер пытается рендерить, отдаем пустой каркас, чтобы не было ошибок
  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="text-2xl font-black text-blue-600">GAVITO</div>
          <div className="flex-1 flex gap-2 w-full">
            <input 
              type="text" placeholder="ძებნა..." 
              className="flex-[2] p-3 bg-slate-100 rounded-2xl outline-none"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="flex-1 p-3 bg-slate-100 rounded-2xl outline-none font-bold"
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
              selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border'
            }`}
          >
            {getIcon(cat.id)} {cat.name}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-[2rem] border shadow-sm hover:shadow-md transition-all">
            <img src={p.image} className="w-full aspect-square object-cover rounded-[1.5rem] mb-4" />
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-slate-400 text-sm flex items-center gap-1">
                <Icons.MapPin size={14}/> {p.location}
            </p>
            <div className="text-blue-600 font-black text-2xl mt-2">{p.price} ₾</div>
          </div>
        ))}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><Icons.X size={24}/></button>
            <h2 className="text-2xl font-black mb-6">დამატება</h2>
            
            <div className="space-y-4">
              <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              <div className="grid grid-cols-2 gap-2">
                <select className="p-4 bg-slate-100 rounded-2xl outline-none" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="p-4 bg-slate-100 rounded-2xl outline-none" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}>
                  {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <input type="number" placeholder="ფასი" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
              <input type="text" placeholder="ფოტოს ლინკი" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" value={tempImage} onChange={(e) => setTempImage(e.target.value)} />

              <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
