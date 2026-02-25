import React from 'react';
import { Search, PlusCircle, Heart, MessageCircle, MapPin, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-[#1e293b]">
      {/* ШАПКА САЙТА (HEADER) */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="text-3xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            GAVITO
          </div>
          
          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <input 
              type="text" 
              placeholder="მოძებნე ყველაფერი... (Поиск)" 
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
              <PlusCircle size={20} />
              <span className="hidden sm:inline">დამატება</span>
            </button>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ИННОВАЦИОННЫЙ БАННЕР С AI */}
        <div className="mb-12 p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-6 bg-blue-500/20 w-fit px-4 py-1.5 rounded-full text-blue-400 text-xs uppercase tracking-widest font-black border border-blue-500/30">
              <Sparkles size={14} /> AI Powered 2.0
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-[1.1]">
              გაყიდე უფრო სწრაფად <br/> <span className="text-blue-500 text-3xl md:text-4xl italic">AI ტექნოლოგიით</span>
            </h1>
            <p className="text-slate-400 mb-8 text-lg">Загрузите фото, и наш искусственный интеллект сам заполнит описание и подберет цену в лари.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2">
                <Zap size={20} fill="currentColor" /> დაწყება
              </button>
            </div>
          </div>
          {/* Декоративный элемент */}
          <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        </div>

        {/* КАТЕГОРИИ */}
        <section className="mb-12">
          <div className="flex gap-4 overflow-x-auto pb