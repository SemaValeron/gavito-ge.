'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, MapPin, Sparkles, Car, Home, Laptop, Dog, X } from 'lucide-react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const allProducts = [
    { id: 1, title: 'iPhone 15 Pro Max', price: '3200', cat: 'ელექტრონიკა', loc: 'თბილისი', img: '📱' },
    { id: 2, title: 'Toyota Prius 2018', price: '12500', cat: 'ავტომობილები', loc: 'ბათუმი', img: '🚗' },
    { id: 3, title: 'ბინა ვაკეში', price: '150000', cat: 'უძრავი ქონება', loc: 'თბილისი', img: '🏠' },
    { id: 4, title: 'MacBook Air M2', price: '2800', cat: 'ელექტრონიკა', loc: 'ქუთაისი', img: '💻' }
  ];

  const analyzePrice = () => {
    if (!tempPrice) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const price = parseFloat(tempPrice);
      if (price > 3500) {
        setAiAnalysis({ status: 'ძვირია', color: 'text-red-500', msg: 'საშუალო ფასი 3200 ₾' });
      } else {
        setAiAnalysis({ status: 'კარგი ფასი', color: 'text-green-600', msg: 'შეესაბამება ბაზარს' });
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const filtered = allProducts.filter(p => 
    (selectedCategory === 'ყველა' || p.cat === selectedCategory) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-blue-600">GAVITO</div>
          <input 
            type="text" 
            placeholder="ძებნა..." 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hidden md:block bg-slate-100 rounded-xl px-4 py-2 w-64 outline-none focus:ring-2 ring-blue-500"
          />
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <PlusCircle size={20}/> დამატება
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="flex gap-2 overflow-x-auto pb-6">
          {['ავტომობილები', 'უძრავი ქონება', 'ელექტრონიკა', 'ცხოველები'].map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-full border whitespace-nowrap ${selectedCategory === c ? 'bg-blue-600 text-white' : 'bg-white'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <div className="text-5xl mb-4 h-32 flex items-center justify-center bg-slate-50 rounded-2xl">{p.img}</div>
              <h3 className="font-bold">{p.title}</h3>
              <div className="text-blue-600 font-black text-xl">{p.price} ₾</div>
              <div className="text-slate-400 text-sm flex items-center gap-1 mt-2"><MapPin size={14}/>{p.loc}</div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X/></button>
            <h2 className="text-2xl font-black mb-6">დამატება</h2>
            <div className="space-y-4">
              <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" onChange={(e) => setTempTitle(e.target.value)}/>
              <div className="flex gap-2">
                <input type="number" placeholder="ფასი" className="flex-1 p-4 bg-slate-100 rounded-2xl outline-none" onChange={(e) => setTempPrice(e.target.value)}/>
                <button onClick={analyzePrice} className="bg-slate-900 text-white px-4 rounded-2xl flex items-center gap-2">
                  {isAnalyzing ? "..." : <Sparkles size={18}/>}
                </button>
              </div>
              {aiAnalysis && (
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className={`font-bold ${aiAnalysis.color}`}>{aiAnalysis.status}</div>
                  <div className="text-sm text-slate-600">{aiAnalysis.msg}</div>
                </div>
              )}
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">გამოქვეყნება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
