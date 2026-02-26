'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, MapPin, Car, Home, Laptop, Briefcase, Settings, Dog, X, ChevronDown, Navigation } from 'lucide-react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedCity, setSelectedCity] = useState('ყველა საქართველო');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ГОРДА ГРУЗИИ
  const cities = [
    'ყველა საქართველო', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ზუგდიდი', 'ფოთი', 'გორი'
  ];

  // ТЕСТОВЫЕ ДАННЫЕ
  const allProducts = [
    { id: 1, title: 'iPhone 15 Pro Max', price: '3,200', cat: 'ელექტრონიკა', loc: 'თბილისი', img: '📱' },
    { id: 2, title: 'Toyota Prius 2018', price: '12,500', cat: 'ავტომობილები', loc: 'ბათუმი', img: '🚗' },
    { id: 3, title: 'ბინა ვაკეში', price: '150,000', cat: 'უძრავი ქონება', loc: 'თბილისი', img: '🏠' },
    { id: 4, title: 'MacBook Air M2', price: '2,800', cat: 'ელექტრონიკა', loc: 'ქუთაისი', img: '💻' },
    { id: 5, title: 'BMW E60 M5', price: '18,000', cat: 'ავტომობილები', loc: 'თბილისი', img: '🏎️' },
  ];

  // ЛОГИКА ФИЛЬТРАЦИИ (по категории + городу + поиску)
  const filteredProducts = allProducts.filter(p => 
    (selectedCategory === 'ყველა' || p.cat === selectedCategory) &&
    (selectedCity === 'ყველა საქართველო' || p.loc === selectedCity) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar */}
          <div className="h-20 flex items-center justify-between gap-6">
            <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer shrink-0" onClick={() => {setSelectedCategory('ყველა'); setSelectedCity('ყველა საქართველო');}}>
              GAVITO
            </div>

            {/* Выбор города */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all font-bold text-sm">
                <MapPin size={16} className="text-blue-600" />
                {selectedCity}
                <ChevronDown size={14} />
              </button>
              
              {isCityOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-[60]">
                  {cities.map(city => (
                    <div 
                      key={city}
                      onClick={() => {setSelectedCity(city); setIsCityOpen(false);}}
                      className="px-4 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-medium transition-colors">
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-1 max-w-xl relative">
              <input 
                type="text" 
                placeholder="ძებნა..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-blue-500 transition-all outline-none font-medium"
              />
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 shrink-0">
              <PlusCircle size={20} />
              <span className="hidden lg:inline text-sm">დამატება</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* КАТЕГОРИИ */}
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
          {[
            { n: 'ავტომობილები', i: <Car /> },
            { n: 'უძრავი ქონება', i: <Home /> },
            { n: 'ელექტრონიკა', i: <Laptop /> },
            { n: 'სამუშაო', i: <Briefcase /> },
            { n: 'მომსახურება', i: <Settings /> },
            { n: 'ცხოველები', i: <Dog /> }
          ].map((cat) => (
            <button 
              key={cat.n} 
              onClick={() => setSelectedCategory(cat.n === selectedCategory ? 'ყველა' : cat.n)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all shrink-0 font-bold whitespace-nowrap ${selectedCategory === cat.n ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 shadow-sm'}`}>
              {cat.i}
              <span className="text-sm tracking-tight">{cat.n}</span>
            </button>
          ))}
        </div>

        {/* СТАТУС ФИЛЬТРА */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {selectedCategory === 'ყველა' ? 'ყველა განცხადება' : selectedCategory} 
            <span className="text-blue-600 ml-2">({selectedCity})</span>
          </h2>
          <div className="text-slate-400 text-sm font-bold">ნაპოვნია: {filteredProducts.length}</div>
        </div>

        {/* ТОВАРЫ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer active:scale-[0.98]">
              <div className="aspect-[4/5] bg-slate-50 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                {p.img}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">{p.title}</h3>
                </div>
                <div className="text-2xl font-black text-blue-600 mb-4">{p.price} ₾</div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <MapPin size={12} className="text-blue-500" />
                  {p.loc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ФОРМА ДОБАВЛЕНИЯ (Модалка) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black mb-8 tracking-tighter">განცხადების დამატება</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">სათაური</label>
                <input type="text" placeholder="მაგ: iPhone 15 Pro" className="w-full bg-slate-50 rounded-2xl py-4 px-6 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ფასი (₾)</label>
                  <input type="number" placeholder="0" className="w-full bg-slate-50 rounded-2xl py-4 px-6 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">მდებარეობა</label>
                  <select className="w-full bg-slate-50 rounded-2xl py-4 px-6 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold appearance-none">
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                გამოქვეყნება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
