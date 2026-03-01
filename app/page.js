'use client';
import React, { useState, useEffect, useMemo } from 'react';

// 🛑 ЗАМЕНИ ЭТУ ССЫЛКУ НА СВОЮ ИЗ CODESPACES (ПОРТ 8080)
const JAVA_API_URL = "https://your-java-link-8080.app.github.dev/api/products";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Поля формы
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');

  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'ყველა', img: '✨' },
    { id: 'cars', name: 'ავტო', img: '🚗' },
    { id: 'realestate', name: 'სახლი', img: '🏠' },
    { id: 'tech', name: 'ტექნიკა', img: '📱' },
    { id: 'home', name: 'ბაღი', img: '🌿' },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕' },
    { id: 'beauty', name: 'მოვლა', img: '💄' },
  ], []);

  // 1. Загрузка данных при старте
  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      if (!res.ok) throw new Error("Ошибка сервера");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
    }
  }

  // 2. Отправка нового товара
  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) {
      alert("შეავსეთ სათაური და ფასი!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(JAVA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tempTitle,
          price: parseFloat(tempPrice),
          category: tempCat,
          location: tempLocation,
          imageUrl: 'https://via.placeholder.com/400' // Временная заглушка для фото
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setTempTitle('');
        setTempPrice('');
        await fetchProducts(); // Обновляем список
      } else {
        alert("Сервер отклонил запрос");
      }
    } catch (error) {
      alert("Ошибка сети: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0b0f1a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* Шапка */}
      <header className="p-4 sticky top-0 z-[100] border-b backdrop-blur-xl bg-white/80 dark:bg-[#0b0f1a]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">
              გამოქვეყნება
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Поиск */}
        <div className="mb-8">
          <input 
            type="text" 
            placeholder="ძებნა..." 
            className="w-full p-4 rounded-2xl border dark:bg-slate-900 outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Категории */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border'}`}
            >
              {cat.img} {cat.name}
            </button>
          ))}
        </div>

        {/* Сетка товаров */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products
            .filter(p => (selectedCategory === 'all' || p.category === selectedCategory))
            .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((p) => (
              <div key={p.id} className="p-4 rounded-[2.5rem] border bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all">
                <img src={p.imageUrl} className="w-full aspect-square object-cover rounded-[2rem] mb-4" alt="" />
                <h3 className="font-bold text-lg px-2 truncate">{p.title}</h3>
                <p className="text-2xl font-black text-blue-600 px-2">{p.price} ₾</p>
                <p className="text-[10px] opacity-40 px-2 mt-2">📍 {p.location}</p>
              </div>
            ))}
        </main>
      </div>

      {/* Модалка */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-[3.5rem] p-8 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <h2 className="text-2xl font-black mb-6">ახალი განცხადება</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="დასახელება" 
                className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none border-2 border-transparent focus:border-blue-500 text-black dark:text-white" 
                value={tempTitle} 
                onChange={(e) => setTempTitle(e.target.value)} 
              />
              <input 
                type="number" 
                placeholder="ფასი" 
                className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none border-2 border-transparent focus:border-blue-500 text-black dark:text-white" 
                value={tempPrice} 
                onChange={(e) => setTempPrice(e.target.value)} 
              />
              
              <select 
                className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none text-black dark:text-white" 
                value={tempCat} 
                onChange={(e) => setTempCat(e.target.value)}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button 
                onClick={handlePublish} 
                disabled={isSubmitting} 
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 active:scale-95 transition-all"
              >
                {isSubmitting ? 'ქვეყნდება...' : 'გამოქვეყნება'}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-full text-center opacity-50 font-bold py-2"
              >
                გაუქმება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
