'use client'; // Это важно для работы кнопок!

import React, { useState } from 'react';
import { Search, PlusCircle, Heart, MessageCircle, MapPin, Sparkles, Zap, ShieldCheck, Car, Home, Laptop, Briefcase, Settings, Dog, X } from 'lucide-react';

export default function Page() {
  // СОСТОЯНИЯ (память нашего сайта)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ТЕСТОВЫЕ ДАННЫЕ (позже они будут в базе данных)
  const allProducts = [
    { id: 1, title: 'iPhone 15 Pro Max', price: '3,200', cat: 'ელექტრონიკა', loc: 'თბილისი', img: '📱' },
    { id: 2, title: 'Toyota Prius 2018', price: '12,500', cat: 'ავტომობილები', loc: 'ბათუმი', img: '🚗' },
    { id: 3, title: 'ბინა ვაკეში', price: '150,000', cat: 'უძრავი ქონება', loc: 'თბილისი', img: '🏠' },
    { id: 4, title: 'MacBook Air M2', price: '2,800', cat: 'ელექტრონიკა', loc: 'ქუთაისი', img: '💻' },
  ];

  // ЛОГИКА ФИЛЬТРАЦИИ
  const filteredProducts = allProducts.filter(p => 
    (selectedCategory === 'ყველა' || p.cat === selectedCategory) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => setSelectedCategory('ყველა')}>
            GAVITO
          </div>
          
          <div className="flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="ძებნა..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
            <PlusCircle size={20} />
            <span className="hidden sm:inline">დამატება</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* КАТЕГОРИИ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
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
              onClick={() => setSelectedCategory(cat.n)}
              className={`flex flex-col items-center p-6 rounded-3xl border transition-all ${selectedCategory === cat.n ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-slate-600 border-slate-100 hover:shadow-md'}`}>
              <div className="mb-2">{cat.i}</div>
              <span className="font-bold text-xs uppercase tracking-tight">{cat.n}</span>
            </button>
          ))}
        </div>

        {/* СПИСОК ТОВАРОВ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group">
              <div className="aspect-square bg-slate-50 flex items-center justify-center text-6xl">
                {p.img}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
                  <div className="text-blue-600 font-black text-xl">{p.price} ₾</div>
                </div>
                <div className="text-slate-400 text-sm mb-4">{p.loc}</div>
                <button className="w-full py-3 bg-slate-50 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                  მიწერა
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО (Форма добавления) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6">განცხადების დამატება</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">დასახელება</label>
                <input type="text" placeholder="მაგ: iPhone 15" className="w-full bg-slate-100 rounded-xl py-3 px-4 border-2 border-transparent focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ფასი (₾)</label>
                <input type="number" placeholder="0" className="w-full bg-slate-100 rounded-xl py-3 px-4 border-2 border-transparent focus:border-blue-500 outline-none" />
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 mt-4">
                გამოქვეყნება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

