'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';

// 🛑 ВСТАВЬ СВОЮ ССЫЛКУ ИЗ CODESPACES НИЖЕ 🛑
const JAVA_API_URL = "https://your-codespace-8080.app.github.dev/api/products";

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

  const cityRef = useRef(null);
  const catRefs = useRef({});

  // Состояния формы
  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isManualCategory, setIsManualCategory] = useState(false);

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი', 'მესტია', 'ბორჯომი'];

  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500', basePrice: 15000, keywords: ['bmw','merc','audi','toyota','honda','nissan','ford','hyundai','kia','volvo','jeep','subaru','lexus','porsche','tesla','mazda','vw','მანქანა','ავტო'] },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600', basePrice: 120000, keywords: ['ბინა','სახლი','აგარაკი','მიწა','ფართი','ოფისი','გირაო','ქირა'] },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600', basePrice: 1500, keywords: ['iphone','samsung','pixel','xiaomi','macbook','ipad','airpods','watch','laptop','desktop','ps5','ps4','tv','ტელევიზორი','კომპიუტერი'] },
    { id: 'home', name: 'ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500', basePrice: 400, keywords: ['ავეჯი','მაგიდა','სკამი','კარადა','დივანი','საწოლი','თარო','ხალიჩა','ყვავილი','ბაღი'] },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500', basePrice: 150, keywords: ['nike','adidas','puma','zara','h&m','gucci','shoes','sneakers','jacket','jeans','dress','bag','ფეხსაცმელი','ბოტასი','ჩანთა'] },
    { id: 'beauty', name: 'მოვლა', img: '💄', color: 'from-rose-400 to-fuchsia-500', basePrice: 80, keywords: ['სუნამო','perfume','parfum','makeup','lipstick','cream','shampoo','ვიტამინი','კრემი'] },
  ], []);

  const ADS = useMemo(() => [
    { text: "GAVITO — პირველი ჭკვიანი მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "AI ანალიზი — ავტომატური ფასის კონტროლი", img: "🤖", color: "from-purple-600 to-pink-600" },
    { text: "იყიდე და გაყიდე მარტივად", img: "🛍️", color: "from-fuchsia-600 to-pink-500" },
  ], []);

  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const adTimer = setInterval(() => setCurrentAd(p => (p + 1) % ADS.length), 5000);
    return () => clearInterval(adTimer);
  }, [ADS.length]);

  // Умный подбор категорий
  useEffect(() => {
    if (isManualCategory || !tempTitle.trim()) return;
    const titleLower = tempTitle.toLowerCase();
    const foundCat = CATEGORIES.find(cat => cat.keywords?.some(kw => titleLower.includes(kw)));
    if (foundCat && tempCat !== foundCat.id) {
      setTempCat(foundCat.id);
    }
  }, [tempTitle, CATEGORIES, tempCat, isManualCategory]);

  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      if (!res.ok) throw new Error("Java Server Error");
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Fetch error:", err.message); }
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    setIsSubmitting(true);
    try {
      const response = await fetch(JAVA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tempTitle.trim(),
          price: parseFloat(tempPrice),
          category: tempCat,
          location: tempLocation,
          imageUrl: previewUrl || 'https://via.placeholder.com/400'
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        setTempTitle('');
        setTempPrice('');
        setPreviewUrl(null);
        await fetchProducts();
      }
    } catch (error) { alert("შეცდომა: " + error.message); }
    finally { setIsSubmitting(false); }
  };

  const aiPriceAnalysis = useMemo(() => {
    const price = parseFloat(tempPrice);
    if (!price || isNaN(price) || !tempTitle.trim()) return null;
    const currentCatData = CATEGORIES.find(c => c.id === tempCat);
    let baseAvg = currentCatData ? currentCatData.basePrice : 500;
    const diff = ((price - baseAvg) / baseAvg) * 100;
    if (diff < -15) return { label: "საუკეთესო ფასი", color: "text-emerald-500", avg: baseAvg, icon: "🔥" };
    if (diff < 15) return { label: "იდეალური ფასი", color: "text-blue-500", avg: baseAvg, icon: "✅" };
    return { label: "მაღალი ფასი", color: "text-rose-500", avg: baseAvg, icon: "🛑" };
  }, [tempPrice, tempTitle, tempCat, CATEGORIES]);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#0b0f1a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <style jsx global>{`
        .nice-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .nice-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dock-item { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .dock-item:hover { transform: scale(1.1) translateY(-2px); }
      `}</style>

      {/* HEADER */}
      <header className={`p-4 sticky top-0 z-[100] border-b backdrop-blur-xl ${darkMode ? 'bg-[#0b0f1a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 active:scale-95 transition-all">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* AD BANNER */}
        <div className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[2.5rem] shadow-2xl">
          {ADS.map((ad, i) => (
            <div key={i} className={`absolute inset-0 w-full h-full flex items-center p-8 bg-gradient-to-r ${ad.color} transition-all duration-1000 ${i === currentAd ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-5xl mr-8 animate-bounce">{ad.img}</div>
              <div className="text-2xl sm:text-4xl font-black text-white max-w-2xl leading-tight">{ad.text}</div>
            </div>
          ))}
        </div>

        {/* SEARCH & CITY */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className={`flex items-center p-2 rounded-[2.5rem] border shadow-xl ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
            <input type="text" className="flex-1 bg-transparent px-6 py-4 outline-none font-bold text-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="იპოვე სასურველი..." />
            <select className="bg-transparent font-black px-6 outline-none text-sm" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              <option value="ყველა">ყველა საქართველო</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center p-6 rounded-[2rem] border transition-all transform hover:-translate-y-2 ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xl' : darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className={`w-12 h-12 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md`}>{cat.img}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => (selectedCategory === 'all' || p.category === selectedCategory) && (selectedCity === 'ყველა' || p.location === selectedCity) && p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
            <div key={p.id} className={`p-4 rounded-[2.5rem] border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-md hover:shadow-2xl'}`}>
              <img src={p.imageUrl} className="w-full aspect-square object-cover rounded-[2rem] mb-4" alt="" />
              <div className="px-2"><span className="text-[10px] font-bold opacity-40 uppercase">📍 {p.location}</span></div>
              <h3 className="font-bold text-lg px-2 truncate mb-2">{p.title}</h3>
              <p className="text-2xl font-black text-blue-600 px-2">{p.price} ₾</p>
            </div>
          ))}
        </main>
      </div>

      {/* PUBLISH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-[3.5rem] ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-900'} shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <span className="font-black uppercase text-[10px] tracking-widest opacity-40">განთავსება</span>
              <button onClick={() => setIsModalOpen(false)} className="text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 nice-scroll">
              <input type="text" placeholder="დასახელება" className="w-full p-5 rounded-2xl font-bold bg-slate-100 dark:bg-slate-900 outline-none" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase opacity-40">კატეგორია</p>
                <div className="flex gap-4 overflow-x-auto py-2 nice-scroll">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button key={cat.id} onClick={() => {setTempCat(cat.id); setIsManualCategory(true);}} className={`dock-item px-8 py-3 rounded-full text-[11px] font-black whitespace-nowrap border ${tempCat === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 opacity-60'}`}>{cat.name}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40">ფასი (₾)</p>
                <input type="number" className="w-full p-6 rounded-2xl font-black text-3xl bg-slate-100 dark:bg-slate-900 outline-none text-blue-600" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                {aiPriceAnalysis && (
                  <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-[11px] font-black uppercase ${aiPriceAnalysis.color}`}>{aiPriceAnalysis.icon} {aiPriceAnalysis.label}</p>
                      <p className="text-[11px] font-bold">ბაზარი: ~{Math.round(aiPriceAnalysis.avg)} ₾</p>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handlePublish} disabled={isSubmitting} className="w-full py-6 rounded-[2.5rem] bg-blue-600 text-white font-black text-xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
                {isSubmitting ? 'ქვეყნდება...' : 'გამოქვეყნება'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
