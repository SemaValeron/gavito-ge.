import React from 'react';
import { Search, PlusCircle, Heart, MessageCircle, MapPin, Sparkles, Zap, ShieldCheck, Car, Home, Laptop, Briefcase, Settings, Dog } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* HEADER — ШАПКА */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
            GAVITO
          </div>
          
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="მოძებნე ყველაფერი... (Поиск)" 
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-blue-500 transition-all outline-none shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
              <PlusCircle size={20} />
              <span className="hidden sm:inline text-sm">დამატება</span>
            </button>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm cursor-pointer"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HERO BANNER — ГЛАВНЫЙ БАННЕР */}
        <div className="mb-12 p-8 md:p-12 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6 bg-blue-500/20 w-fit px-4 py-1.5 rounded-full text-blue-400 text-xs uppercase tracking-widest font-black border border-blue-500/30">
              <Sparkles size={14} /> AI Powered
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              იყიდე და გაყიდე <br/> <span className="text-blue-500">მარტივად</span>
            </h1>
            <p className="text-slate-400 mb-8 text-lg md:text-xl font-medium">Первый в Грузии маркетплейс с искусственным интеллектом для оценки ваших вещей.</p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 shadow-xl">
              <Zap size={20} fill="currentColor" /> დავიწყოთ
            </button>
          </div>
          <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        </div>

        {/* CATEGORIES — КАТЕГОРИИ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {[
            { n: 'ავტომობილები', i: <Car />, color: 'bg-orange-100 text-orange-600' },
            { n: 'უძრავი ქონება', i: <Home />, color: 'bg-blue-100 text-blue-600' },
            { n: 'ელექტრონიკა', i: <Laptop />, color: 'bg-purple-100 text-purple-600' },
            { n: 'სამუშაო', i: <Briefcase />, color: 'bg-green-100 text-green-600' },
            { n: 'მომსახურება', i: <Settings />, color: 'bg-red-100 text-red-600' },
            { n: 'ცხოველები', i: <Dog />, color: 'bg-yellow-100 text-yellow-600' }
          ].map((cat) => (
            <button key={cat.n} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className={`p-4 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.i}
              </div>
              <span className="font-bold text-sm text-slate-700 uppercase tracking-tight">{cat.n}</span>
            </button>
          ))}
        </div>

        {/* LISTINGS — ОБЪЯВЛЕНИЯ */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">ახალი განცხადებები</h2>
            <p className="text-slate-500 font-medium">Самые свежие предложения сегодня</p>
          </div>
          <button className="text-blue-600 font-bold hover:text-blue-700 transition-colors">ყველას ნახვა</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="aspect-square bg-slate-100 relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm z-10">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-[10px] font-black uppercase text-slate-700">Verified</span>
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition-colors z-10">
                  <Heart size={20} />
                </button>
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">
                  Image Holder
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">Товар {i}</h3>
                  <div className="text-blue-600 font-black text-xl">Цена ₾</div>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-4 font-medium">
                  <MapPin size={14} />
                  <span>თბილისი</span>
                </div>
                <button className="w-full py-3 bg-slate-50 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-bold hover:bg-blue-600 hover:text-white transition-all">
                  <MessageCircle size={18} />
                  მიწერა
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 bg-white text-center">
        <div className="text-2xl font-black text-slate-400 mb-4 tracking-tighter">GAVITO GEORGIA</div>
        <p className="text-slate-400 text-sm font-medium">© 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}
