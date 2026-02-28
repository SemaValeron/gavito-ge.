'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';

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

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'ფოთი', 'გორი', 'ზუგდიდი'];

  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'ყველა', img: '✨', color: 'from-blue-500 to-indigo-600' },
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500', basePrice: 15000, keywords: ['bmw','merc','audi','toyota','honda','nissan','ford','hyundai','kia','volvo','jeep','subaru','lexus','porsche','tesla','mazda','vw','მანქანა','ავტო','საბურავი','ნაწილები','moto','bike'] },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600', basePrice: 120000, keywords: ['ბინა','სახლი','აგარაკი','მიწა','ფართი','ოფისი','გირაო','ქირა','flat','house','apartment','rent','land'] },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600', basePrice: 1500, keywords: ['iphone','samsung','pixel','xiaomi','macbook','ipad','airpods','watch','laptop','desktop','gpu','rtx','ps5','ps4','tv','ტელევიზორი','მაცივარი','კომპიუტერი','ტელეფონი','camera','canon','sony'] },
    { id: 'home', name: 'ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500', basePrice: 400, keywords: ['ავეჯი','მაგიდა','სკამი','კარადა','დივანი','საწოლი','თარო','ხალიჩა','ყვავილი','ბაღი','ინსტრუმენტი','table','chair','sofa','bed','garden'] },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500', basePrice: 150, keywords: ['nike','adidas','puma','zara','h&m','gucci','prada','jordan','shoes','sneakers','jacket','jeans','dress','bag','ფეხსაცმელი','ბოტასი','კაბა','ქურთუკი','ჩანთა'] },
    { id: 'beauty', name: 'მოვლა', img: '💄', color: 'from-rose-400 to-fuchsia-500', basePrice: 80, keywords: ['სუნამო','perfume','parfum','makeup','lipstick','cream','shampoo','dior','chanel','ვიტამინი','კრემი','მაკიაჟი','შამპუნი'] },
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
    const handleOutsideClick = (e) => { if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityOpen(false); };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => { clearInterval(adTimer); document.removeEventListener('mousedown', handleOutsideClick); };
  }, [ADS.length]);

  useEffect(() => {
    if (isManualCategory || !tempTitle) return;
    const titleLower = tempTitle.toLowerCase();
    const foundCat = CATEGORIES.find(cat => cat.keywords?.some(kw => titleLower.includes(kw)));
    if (foundCat && tempCat !== foundCat.id) {
      setTempCat(foundCat.id);
      scrollCatToCenter(foundCat.id);
    }
  }, [tempTitle, CATEGORIES, tempCat, isManualCategory]);

  const scrollCatToCenter = (id) => {
    requestAnimationFrame(() => {
      if (catRefs.current[id]) {
        catRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  };

  const handleManualCatSelect = (id) => {
    setIsManualCategory(true);
    setTempCat(id);
    scrollCatToCenter(id);
  };

  const resetToAi = () => {
    setIsManualCategory(false);
    const titleLower = tempTitle.toLowerCase();
    const foundCat = CATEGORIES.find(cat => cat.keywords?.some(kw => titleLower.includes(kw)));
    if (foundCat) {
      setTempCat(foundCat.id);
      scrollCatToCenter(foundCat.id);
    }
  };

  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) { console.error("Fetch error:", err.message); }
  }

  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    if (isSubmitting) return;

    const numericPrice = parseFloat(tempPrice);
    if (isNaN(numericPrice)) return alert("ფასი უნდა იყოს რიცხვი!");

    setIsSubmitting(true);
    
    try {
      // დამატებითი შემოწმება კავშირზე
      if (!window.navigator.onLine) {
        throw new Error("თქვენ არ გაქვთ ინტერნეტი!");
      }

      const { error } = await supabase.from('products').insert([
        { 
          title: tempTitle.trim(), 
          price: numericPrice, 
          category: tempCat, 
          location: tempLocation, 
          image: previewUrl || 'https://via.placeholder.com/400' 
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setTempTitle('');
      setTempPrice('');
      setPreviewUrl(null);
      setIsManualCategory(false);
      await fetchProducts();
      
    } catch (error) {
      console.error('Publish error:', error);
      
      // დეტალური შეტყობინება Failed to fetch-ზე
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        alert("კავშირის შეცდომა (Failed to fetch). გთხოვთ: \n1. გამორთეთ VPN ან AdBlock. \n2. შეამოწმეთ ინტერნეტი. \n3. დარწმუნდით, რომ Supabase URL სწორია.");
      } else {
        alert("შეცდომა: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const aiPriceAnalysis = useMemo(() => {
    const price = parseFloat(tempPrice);
    if (!price || isNaN(price) || !tempTitle) return null;
    const currentCatData = CATEGORIES.find(c => c.id === tempCat);
    let baseAvg = currentCatData ? currentCatData.basePrice : 500;
    const premiumKeywords = ['pro', 'max', 'ultra', 'm5', 'amg', 'iphone', 'macbook', 'porsche'];
    if (premiumKeywords.some(kw => tempTitle.toLowerCase().includes(kw))) baseAvg *= 1.4;
    const diff = ((price - baseAvg) / baseAvg) * 100;
    if (diff < -35) return { label: "საეჭვოდ დაბალი", color: "text-amber-500", avg: baseAvg, icon: "⚠️" };
    if (diff < -15) return { label: "საუკეთესო ფასი", color: "text-emerald-500", avg: baseAvg, icon: "🔥" };
    if (diff < 15) return { label: "იდეალური ფასი", color: "text-blue-500", avg: baseAvg, icon: "✅" };
    if (diff < 40) return { label: "მაღალი ფასი", color: "text-slate-400", avg: baseAvg, icon: "📊" };
    return { label: "ძალიან ძვირია", color: "text-rose-500", avg: baseAvg, icon: "🛑" };
  }, [tempPrice, tempTitle, tempCat, CATEGORIES]);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#0b0f1a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <style jsx global>{`
        html, body { background-color: ${darkMode ? '#0b0f1a' : '#f8fafc'}; transition: background-color 0.5s; overflow-x: hidden; }
        .nice-scroll::-webkit-scrollbar { height: 10px; }
        .nice-scroll::-webkit-scrollbar-thumb { background: ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}; border-radius: 12px; }
        .dock-item { transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); }
        .dock-item:hover { transform: scale(1.08); }
        @keyframes pulse-soft { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }
        .ai-pulse { animation: pulse-soft 2s infinite; }
      `}</style>

      <header className={`p-4 sticky top-0 z-[100] border-b backdrop-blur-xl ${darkMode ? 'bg-[#0b0f1a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>GAVITO</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl transition-all">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => { setIsModalOpen(true); setIsManualCategory(false); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 active:scale-95 transition-all">გამოქვეყნება</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* BANNER */}
        <div className="relative w-full h-48 sm:h-64 mb-10 overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-800">
          {ADS.map((ad, i) => (
            <div key={i} className={`absolute inset-0 w-full h-full flex items-center p-8 bg-gradient-to-r ${ad.color} transition-all duration-1000 ${i === currentAd ? 'opacity-100' : 'opacity-0 translate-x-full'}`}>
              <div className="text-5xl mr-8 animate-bounce">{ad.img}</div>
              <div className="text-2xl sm:text-4xl font-black text-white max-w-2xl leading-tight">{ad.text}</div>
            </div>
          ))}
        </div>

        {/* SEARCH & CITIES */}
        <div className="relative group max-w-4xl mx-auto mb-12 z-50">
          <div className={`relative flex items-center p-1.5 rounded-[2.5rem] border transition-all ${darkMode ? 'bg-[#0f172a] border-slate-800 shadow-xl' : 'bg-white shadow-xl border-slate-100'}`}>
            <div className="flex-1 flex items-center px-6">
              <span className="mr-4 text-2xl opacity-30">🔍</span>
              <input type="text" className="w-full bg-transparent outline-none font-bold text-lg py-4" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="იპოვე სასურველი..." />
            </div>
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <div className="relative" ref={cityRef}>
              <button onClick={() => setIsCityOpen(!isCityOpen)} className="flex items-center gap-2 px-6 py-3 font-black text-sm transition-all hover:opacity-70">
                <span>{selectedCity}</span> <span>▼</span>
              </button>
              {isCityOpen && (
                <div className={`absolute right-0 top-full mt-3 w-56 p-2 rounded-3xl shadow-2xl z-[60] border animate-in fade-in zoom-in-95 duration-200 ${darkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
                  <button onClick={() => { setSelectedCity('ყველა'); setIsCityOpen(false); }} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50'}`}>📍 ყველა</button>
                  {CITIES.map((city) => (
                    <button key={city} onClick={() => { setSelectedCity(city); setIsCityOpen(false); }} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50'}`}>{city}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center p-6 rounded-[2rem] border transition-all duration-300 transform hover:-translate-y-2 ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xl border-blue-400' : darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className={`w-12 h-12 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md`}>{cat.img}</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {products.filter(p => (selectedCategory === 'all' || p.category === selectedCategory) && (selectedCity === 'ყველა' || p.location === selectedCity) && p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
            <div key={p.id} className={`p-4 rounded-[2.5rem] border transition-all duration-500 ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-600' : 'bg-white border-slate-100 hover:shadow-2xl'}`}>
              <img src={p.image} className="w-full aspect-square object-cover rounded-[2rem] mb-4 shadow-sm" alt="" />
              <div className="px-2 mb-1"><span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{p.location}</span></div>
              <h3 className="font-bold text-lg px-2 truncate mb-2">{p.title}</h3>
              <p className="text-2xl font-black text-blue-600 px-2">{p.price} ₾</p>
            </div>
          ))}
        </main>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-[3.5rem] ${darkMode ? 'bg-[#0f172a] border border-slate-800 text-white' : 'bg-white text-slate-900'} shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <span className="font-black uppercase text-[10px] tracking-widest opacity-40">განთავსება</span>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-transform hover:rotate-90">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 nice-scroll">
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] cursor-pointer bg-slate-50 dark:bg-slate-900/50 overflow-hidden hover:border-blue-500 transition-all">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center"><span className="text-4xl block mb-2 opacity-20">📸</span><span className="text-[10px] font-bold opacity-30 uppercase">ატვირთეთ ფოტო</span></div>}
                <input type="file" className="hidden" onChange={(e) => { if(e.target.files[0]) setPreviewUrl(URL.createObjectURL(e.target.files[0])); }} />
              </label>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 ml-2 tracking-widest">დასახელება</p>
                <input type="text" placeholder="მაგ: iPhone 15 Pro..." className={`w-full p-5 rounded-2xl font-bold outline-none border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 focus:border-blue-500' : 'bg-slate-100 border-transparent focus:bg-white focus:border-blue-500'}`} value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2 min-h-[30px]">
                   <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">კატეგორია</p>
                   {isManualCategory && (
                     <button onClick={resetToAi} className="ai-pulse flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all transform active:scale-90">
                       <span>🤖</span> რობოტის დაბრუნება
                     </button>
                   )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 nice-scroll snap-x px-6">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button key={cat.id} ref={el => catRefs.current[cat.id] = el} onClick={() => handleManualCatSelect(cat.id)} className={`dock-item px-8 py-3 rounded-full text-[11px] font-black whitespace-nowrap border snap-center flex-shrink-0 transition-all ${tempCat === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-slate-100 dark:bg-slate-900 border-transparent opacity-60'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase opacity-40 ml-2 tracking-widest">ლოკაცია</p>
                <div className="flex flex-wrap gap-2 px-1">
                  {CITIES.map(city => (
                    <button key={city} onClick={() => setTempLocation(city)} className={`dock-item px-5 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${tempLocation === city ? 'bg-slate-800 text-white border-slate-800' : 'bg-transparent border-slate-200 opacity-50 dark:border-slate-700'}`}>{city}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 ml-2 tracking-widest">ფასი (₾)</p>
                <input type="number" placeholder="0.00" className={`w-full p-6 rounded-2xl font-black text-3xl outline-none border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 focus:border-blue-500 text-blue-500' : 'bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 text-blue-600'}`} value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                {aiPriceAnalysis && (
                  <div className={`p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300 ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{aiPriceAnalysis.icon}</span>
                        <div><p className={`text-[11px] font-black uppercase tracking-tight ${aiPriceAnalysis.color}`}>{aiPriceAnalysis.label}</p></div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold opacity-60">ბაზრის ფასი</p>
                        <p className="text-[13px] font-black">~{Math.round(aiPriceAnalysis.avg)} ₾</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handlePublish} disabled={isSubmitting} className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-xl transition-all ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}>
                {isSubmitting ? 'ქვეყნდება...' : 'გამოქვეყნება'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
