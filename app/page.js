'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, Heart, MessageCircle, MapPin, Sparkles, Zap, ShieldCheck, Car, Home, Laptop, Briefcase, Settings, Dog, X, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedCity, setSelectedCity] = useState('ყველა საქართველო');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояния для формы и AI
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cities = ['ყველა საქართველო', 'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ზუგდიდი', 'ფოთი', 'გორი'];

  const allProducts = [
    { id: 1, title: 'iPhone 15 Pro Max', price: '3200', cat: 'ელექტრონიკა', loc: 'თბილისი', img: '📱' },
    { id: 2, title: 'Toyota Prius 2018', price: '12500', cat: 'ავტომობილები', loc: 'ბათუმი', img: '🚗' },
    { id: 3, title: 'ბინა ვაკეში', price: '150000', cat: 'უძრავი ქონება', loc: 'თბილისი', img: '🏠' },
    { id: 4, title: 'MacBook Air M2', price: '2800', cat: 'ელექტრონიკა', loc: 'ქუთაისი', img: '💻' },
    { id: 5, title: 'BMW E60 M5', price: '18000', cat: 'ავტომობილები', loc: 'თბილისი', img: '🏎️' },
  ];

  // ФУНКЦИЯ AI РАСЧЕТА ЦЕНЫ
  const analyzePrice = () => {
    if (!tempPrice || !tempTitle) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const price = parseFloat(tempPrice);
      let status = '';
      let color = '';
      let message = '';

      if (tempTitle.toLowerCase().includes('iphone')) {
        if (price < 2800) { 
            status = 'სუპერ ფასი!'; 
            color = 'text-green-600'; 
            message = 'ეს ფასი ძალიან სწრაფად გაყიდის ნივთს.'; 
        }
        else if (price > 3500) { 
            status = 'ძვირია'; 
            color = 'text-red-500'; 
            message = 'საშუალო საბაზრო ფასი არის 3200 ₾.'; 
        }
        else { 
            status = 'ნორმალური ფასი'; 
            color = 'text-blue-600'; 
            message = 'ფასი შეესაბამება ბაზარს.'; 
        }
      } else {
        status = 'გაანალიზებულია'; 
        color = 'text-slate-600'; 
        message = 'AI გირჩევთ ამ ფასის დატოვებას.';
      }

      setAiAnalysis({ status, color, message });
      setIsAnalyzing(false);
    }, 1500);
  };

  const filteredProducts = allProducts.filter(p => 
    (selectedCategory === 'ყველა' || p.cat === selectedCategory) &&
    (selectedCity === 'ყველა საქართველო' || p.loc === selectedCity) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => {setSelectedCategory('ყველა'); setSelectedCity('ყველა საქართველო');}}>
            GAVITO
          </div>
          
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="მოძებნე ყველაფერი..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 shadow-lg active:scale-95">
            <PlusCircle size={20} />
            <span className="hidden sm:inline">დამატება</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
          {['ავტომობილები', 'უძრავი ქონება', 'ელექტრონიკა', 'ცხოველები'].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-2xl border font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all p-4 group">
              <div className="aspect-square bg-slate-50 rounded-[2rem] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {p.img}
              </div>
              <div className="mt-4 px-2">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <div className="text-2xl font-black text-blue-600 mt-1">{p.price} ₾</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-3 font-bold uppercase">
                  <MapPin size={12} /> {p.loc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 relative shadow-2xl overflow-hidden">
            <button onClick={() => {setIsModalOpen(false); setAiAnalysis(null);}} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
              <X size={28} />
            </button>
            
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              განცხადების დამატება <Sparkles className="text-blue-500" size={20} />
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">დასახელება</label>
                <input 
                  type="text" 
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="მაგ: iPhone 15 Pro" 
                  className="w-full bg-slate-50 rounded-2xl py-4 px-6 border-2 border-transparent focus:border-blue-500 outline-none font-bold" 
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">ფასი (₾)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    placeholder="0" 
                    className="flex-1 bg-slate-50 rounded-2xl py-4 px-6 border-2 border-transparent focus:border-blue-500 outline-none font-bold text-xl text-blue-600" 
                  />
                  <button 
                    onClick={analyzePrice}
                    disabled={isAnalyzing || !tempPrice}
                    className="bg-slate-900 text-white px-6 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50">
                    {isAnalyzing ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <Sparkles size={18} />}
                    AI შეფასება
                  </button>
                </div>
              </div>

              {aiAnalysis && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <Sparkles className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <div className={`font-black text-lg ${aiAnalysis.color}`}>{aiAnalysis.status}</div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{aiAnalysis.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95 mt-4">
                გამოქვეყნება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
