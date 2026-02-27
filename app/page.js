Этот тип ошибки (Expression expected) обычно означает, что в коде остался «мусор» от предыдущих правок — например, лишняя скобка, запятая или невидимый символ в самом начале файла.

Давай сделаем максимально «чистую» установку. Я подготовил код, в котором нет ничего лишнего, только стандартный JavaScript (без TypeScript-символов типа any[] или : string), чтобы Vercel не спотыкался.

Что нужно сделать:
Полностью очисти файл page.js (или page.tsx). В нем не должно остаться ни одной точки.

Скопируй и вставь этот код:

JavaScript
'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('ყველა ქალაქი');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [tempCat, setTempCat] = useState('tech');

  const CATEGORIES = [
    { id: 'all', name: 'ყველა', icon: '🛍️' },
    { id: 'cars', name: 'ავტო', icon: '🚗' },
    { id: 'realestate', name: 'უძრავი ქონება', icon: '🏠' },
    { id: 'tech', name: 'ტექნიკა', icon: '📱' },
    { id: 'jobs', name: 'ვაკანსია', icon: '💼' },
  ];

  const CITIES = ['ყველა ქალაქი', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching:', error);
    } else {
      setProducts(data || []);
    }
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    
    const { error } = await supabase.from('products').insert([{ 
      title: tempTitle, 
      price: parseFloat(tempPrice), 
      location: tempLocation, 
      category: tempCat, 
      image: 'https://via.placeholder.com/300'
    }]);

    if (error) {
      alert("შეცდომა ბაზაში: " + error.message);
    } else {
      setIsModalOpen(false);
      setTempTitle('');
      setTempPrice('');
      fetchProducts();
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ყველა ქალაქი' || p.location === selectedCity;
    return matchesSearch && matchesCat && matchesCity;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-black text-blue-600">GAVITO</div>
          <div className="flex-1 flex gap-2 w-full max-w-xl">
            <input 
              type="text" 
              placeholder="ძებნა..." 
              className="flex-[2] p-3 bg-slate-100 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="flex-1 p-3 bg-slate-100 rounded-2xl outline-none font-bold"
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors"
          >
            დამატება
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto py-6">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white border'
            }`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-[2rem] border shadow-sm">
            <div className="w-full aspect-square bg-slate-100 rounded-[1.5rem] mb-4 flex items-center justify-center text-4xl">📦</div>
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-slate-400 text-sm">📍 {p.location}</p>
            <div className="text-blue-600 font-black text-2xl mt-2">{p.price} ₾</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400 font-medium">
            განცხადებები არ მოიძებნა
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 font-bold p-2 text-slate-400 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black mb-6">დამატება</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="სათაური" 
                className="w-full p-4 bg-slate-100 rounded-2xl outline-none" 
                value={tempTitle} 
                onChange={(e) => setTempTitle(e.target.value)} 
              />
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="p-4 bg-slate-100 rounded-2xl outline-none" 
                  value={tempCat} 
                  onChange={(e) => setTempCat(e.target.value)}
                >
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select 
                  className="p-4 bg-slate-100 rounded-2xl outline-none" 
                  value={tempLocation} 
                  onChange={(e) => setTempLocation(e.target.value)}
                >
                  {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input 
                type="number" 
                placeholder="ფასი" 
                className="w-full p-4 bg-slate-100 rounded-2xl outline-none" 
                value={tempPrice} 
                onChange={(e) => setTempPrice(e.target.value)} 
              />
              <button 
                onClick={handlePublish} 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
              >
                გამოქვეყნება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
