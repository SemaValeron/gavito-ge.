'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';

// 🛑 ВСТАВЬ СВОЮ ССЫЛКУ ИЗ CODESPACES НИЖЕ 🛑
const JAVA_API_URL = "https://your-java-link-8080.app.github.dev/api/products";

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

  const [tempTitle, setTempTitle] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempCat, setTempCat] = useState('tech');
  const [tempLocation, setTempLocation] = useState('თბილისი');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isManualCategory, setIsManualCategory] = useState(false);

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი', 'თელავი', 'მესტია', 'ბორჯომი'];

  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500', basePrice: 15000, keywords: ['bmw','merc','audi','toyota','honda','nissan','ford','hyundai','kia','volvo','jeep','subaru','lexus','porsche','tesla','mazda','vw'] },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600', basePrice: 120000, keywords: ['ბინა','სახლი','აგარაკი','მიწა','ფართი','ოფისი'] },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600', basePrice: 1500, keywords: ['iphone','samsung','pixel','xiaomi','macbook','ipad','laptop','ps5','tv'] },
    { id: 'home', name: 'ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500', basePrice: 400, keywords: ['ავეჯი','მაგიდა','სკამი','კარადა','დივანი','ბაღი'] },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500', basePrice: 150, keywords: ['nike','adidas','zara','shoes','sneakers','jacket'] },
    { id: 'beauty', name: 'მოვლა', img: '💄', color: 'from-rose-400 to-fuchsia-500', basePrice: 80, keywords: ['სუნამო','perfume','makeup','lipstick'] },
  ], []);

  const ADS = useMemo(() => [
    { text: "GAVITO — პირველი ჭკვიანი მარკეტპლეისი", img: "🚀", color: "from-blue-600 to-indigo-700" },
    { text: "AI ანალიზი — ავტომატური ფასის კონტროლი", img: "🤖", color: "from-purple-600 to-pink-600" },
  ], []);

  const [currentAd, setCurrentAd] = useState(0);

  const resetFormAndClose = () => {
    setIsModalOpen(false);
    setTempTitle('');
    setTempPrice('');
    setTempCat('tech');
    setTempLocation('თბილისი');
    setPreviewUrl(null);
    setIsManualCategory(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const adTimer = setInterval(() => setCurrentAd(p => (p + 1) % ADS.length), 5000);
    const handleOutsideClick = (e) => { if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityOpen(false); };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => { clearInterval(adTimer); document.removeEventListener('mousedown', handleOutsideClick); };
  }, [ADS.length]);

  useEffect(() => {
    if (isManualCategory || !tempTitle.trim()) return;
    const titleLower = tempTitle.toLowerCase();
    const foundCat = CATEGORIES.find(cat => cat.keywords?.some(kw => titleLower.includes(kw)));
    if (foundCat && tempCat !== foundCat.id) {
      setTempCat(foundCat.id);
      if (catRefs.current[foundCat.id]) {
        catRefs.current[foundCat.id].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [tempTitle, CATEGORIES, tempCat, isManualCategory]);

  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      if (!res.ok) throw new Error("Server Error");
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
        resetFormAndClose();
        fetchProducts();
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
    return { label: "მაღალი ფასი", color: "text-rose-500", avg: baseAvg, icon: "📊" };
  }, [tempPrice, tempTitle, tempCat, CATEGORIES]);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0b0f1a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <header className="p-4 sticky top-0 z-[100] border-b backdrop-blur-xl bg-white/80 dark:bg-[#0b0f1a]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600">GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`p-6 rounded-[2rem] border transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900'}`}>
              <div className="text-2xl mb-2">{cat.img}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => (selectedCategory === 'all' || p.category === selectedCategory)).map((p) => (
            <div key={p.id} className="p-4 rounded-[2.5rem] border bg-white dark:bg-slate-900">
              <img src={p.imageUrl} className="w-full aspect-square object-cover rounded-[2rem] mb-4" alt="" />
              <h3 className="font-bold text-lg px-2">{p.title}</h3>
              <p className="text-2xl font-black text-blue-600 px-2">{p.price} ₾</p>
              <p className="text-[10px] opacity-40 px-2 mt-2">📍 {p.location}</p>
            </div>
          ))}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-[3.5rem] p-8 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <h2 className="text-2xl font-black mb-6">ახალი განცხადება</h2>
            <div className="space-y-4">
              <input type="text" placeholder="დასახელება" className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              <input type="number" placeholder="ფასი" className="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
              
              <div className="flex gap-2 overflow-x-auto py-2">
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <button key={c.id} onClick={() => setTempCat(c.id)} className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold ${tempCat === c.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{c.name}</button>
                ))}
              </div>

              <button onClick={handlePublish} disabled={isSubmitting} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl">
                {isSubmitting ? 'ქვეყნდება...' : 'გამოქვეყნება'}
              </button>
              <button onClick={resetFormAndClose} className="w-full text-center opacity-50 font-bold">გაუქმება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
