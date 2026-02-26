'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, PlusCircle, MapPin, X, Moon, Sun, ShoppingBag } from 'lucide-react';

export default function Page() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    await supabase.from('products').insert([{ 
      title: tempTitle, price: parseFloat(tempPrice), location: 'თბილისი', image: '📦' 
    }]);
    setIsModalOpen(false);
    setTempTitle('');
    setTempPrice('');
    fetchProducts();
  };

  const filtered = products.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
        
        <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-2xl font-black text-blue-600 flex items-center gap-2">GAVITO</div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">
                დამატება
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 shadow-sm">
                <div className="aspect-square mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl text-6xl">{p.image || '📦'}</div>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <div className="text-blue-600 font-black text-2xl">{p.price} ₾</div>
              </div>
            ))}
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24}/></button>
              <h2 className="text-2xl font-black mb-6 uppercase">დამატება</h2>
              <div className="space-y-4">
                <input type="text" placeholder="სათაური" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                <input type="number" placeholder="ფასი" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black transition-all active:scale-95">გამოქვეყნება</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
