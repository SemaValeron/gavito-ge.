'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';

// 🛑 ВСТАВЬ СВОЮ ССЫЛКУ ИЗ CODESPACES НИЖЕ 🛑
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
    { id: 'cars', name: 'ავტო', img: '🚗', color: 'from-orange-400 to-red-500', basePrice: 15000, keywords: ['bmw','merc','audi','toyota','honda','nissan','ford','hyundai','kia','volvo','jeep','subaru','lexus','porsche','tesla','mazda','vw','მანქანა','ავტო'] },
    { id: 'realestate', name: 'სახლი', img: '🏠', color: 'from-emerald-400 to-teal-600', basePrice: 120000, keywords: ['ბინა','სახლი','აგარაკი','მიწა','ფართი','ოფისი'] },
    { id: 'tech', name: 'ტექნიკა', img: '📱', color: 'from-purple-500 to-pink-600', basePrice: 1500, keywords: ['iphone','samsung','pixel','xiaomi','macbook','ipad','laptop','ps5','tv'] },
    { id: 'home', name: 'ბაღი', img: '🌿', color: 'from-yellow-400 to-orange-500', basePrice: 400, keywords: ['ავეჯი','მაგიდა','სკამი','კარადა','დივანი','ბაღი'] },
    { id: 'fashion', name: 'ტანსაცმელი', img: '👕', color: 'from-sky-400 to-blue-500', basePrice: 150, keywords: ['nike','adidas','zara','shoes','sneakers','jacket','ჩანთა'] },
    { id: 'beauty', name: 'მოვლა', img: '💄', color: 'from-rose-400 to-fuchsia-500', basePrice: 80, keywords: ['სუნამო','perfume','makeup','lipstick','კრემი'] },
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
    fetchProducts(); // Вызов функции Java
    const adTimer = setInterval(() => setCurrentAd(p => (p + 1) % ADS.length), 5000);
    const handleOutsideClick = (e) => { if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityOpen(false); };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => { clearInterval(adTimer); document.removeEventListener('mousedown', handleOutsideClick); };
  }, [ADS.length]);

  // --- ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ИЗ JAVA ---
  async function fetchProducts() {
    try {
      const res = await fetch(JAVA_API_URL);
      if (!res.ok) throw new Error("Server Error");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  }

  // --- ФУНКЦИЯ ОТПРАВКИ ДАННЫХ В JAVA ---
  const handlePublish = async () => {
    if (!tempTitle || !tempPrice) return alert("შეავსეთ ველები!");
    const numericPrice = parseFloat(tempPrice);
    setIsSubmitting(true);

    const productData = {
      title: tempTitle.trim(),
      price: numericPrice,
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
        resetFormAndClose();
        await fetchProducts(); // Обновляем список
      } else {
        throw new Error("Ошибка при сохранении");
      }
    } catch (error) {
      alert("შეცდომა: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Остальная логика AI Price Analysis и рендеринг остаются такими же, как в твоем коде) ...
  // Убедись, что в рендеринге карточки товара используется p.imageUrl (как в Java), а не p.image.

  // ВАЖНО: В твоем коде ниже замени p.image на p.imageUrl в теге <img>
  // <img src={p.imageUrl} className="..." />
