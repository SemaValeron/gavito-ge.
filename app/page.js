'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';

// ВСТАВЬ СЮДА СВОЮ ССЫЛКУ ИЗ ГИТХАБА (БЕЗ "/" В КОНЦЕ)
const JAVA_API_URL = "https://humble-acorn-696645v9rgp5f4474-8080.app.github.dev/api/products";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ყველა');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояния формы
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი'];
  const CATEGORIES = [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500' },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600' },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600' }
  ];

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  // --- ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ИЗ JAVA ---
  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      if (!res.ok) throw new Error("Java Server Error");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка подключения к Java:", err);
    }
  }

  // --- ФУНКЦИЯ ОТПРАВКИ ДАННЫХ В JAVA ---
  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    setIsSubmitting(true);

    const productData = {
      title: tempTitle,
      price: parseFloat(tempPrice),
      category: tempCat,
      location: tempLocation,
      imageUrl: previewUrl || 'https://via.placeholder.com/400'
    };

    try {
      const response = await fetch(JAVA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setTempTitle('');
        setTempPrice('');
        fetchProducts(); // Сразу обновляем список товаров
      }
    } catch (error) {
      alert("Ошибка отправки: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0b0f1a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* HEADER */}
      <header className="p-4 sticky top-0 z-[100] border-b backdrop-blur-xl bg-white/80 dark:bg-[#0b0f1a]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* КАТЕГОРИИ */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900'}`}>
              {cat.img} {cat.name}
            </button>
          ))}
        </div>

        {/* СПИСОК ТОВАРОВ */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(p => selectedCategory === 'all' || p.category === selectedCategory).map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <img src={p.imageUrl} className="w-full aspect-square object-cover rounded-2xl mb-4" alt="" />
              <h3 className="font-bold text-lg mb-1">{p.title}</h3>
              <p className="text-blue-600 font-black text-xl">{p.price} ₾</p>
              <p className="text-xs opacity-50 mt-2">📍 {p.location}</p>
            </div>
          ))}
        </main>
      </div>

      {/* МОДАЛКА ПУБЛИКАЦИИ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-xl">✕</button>
            <h2 className="text-2xl font-black mb-6">ახალი განცხადება</h2>
            
            <div className="space-y-4">
              <input type="text" placeholder="სათაური" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              <input type="number" placeholder="ფასი" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
              
              <select className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none" value={tempCat} onChange={(e) => setTempCat(e.target.value)}>
                {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <button onClick={handlePublish} disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all">
                {isSubmitting ? 'ქვეყნდება...' : 'გამოქვეყნება'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
