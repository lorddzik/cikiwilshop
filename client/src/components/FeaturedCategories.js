import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Mapping emoji untuk setiap kategori
const categoryEmoji = {
  'Smartphone': '📱',
  'Laptop': '💻',
  'Tablet': '📱',
  'Smartwatch': '⌚',
  'Headphone': '🎧',
  'Speaker': '🔊',
  'Earbuds': '🎵',
  'Powerbank': '🔋',
  'Charger': '⚡',
  'Kabel': '🔌',
  'Casing': '📦',
  'Monitor': '🖥️',
  'Keyboard': '⌨️',
  'Mouse': '🖱️',
  'Webcam': '📷',
  'Router': '📡',
  'SSD': '💾',
  'RAM': '🎯',
  'VGA': '🎮',
  'Aksesoris': '🛠️',
};

// Gradient background untuk setiap kategori
const categoryGradient = {
  'Smartphone': 'from-blue-400 to-blue-600',
  'Laptop': 'from-purple-400 to-purple-600',
  'Tablet': 'from-indigo-400 to-indigo-600',
  'Smartwatch': 'from-pink-400 to-pink-600',
  'Headphone': 'from-green-400 to-green-600',
  'Speaker': 'from-red-400 to-red-600',
  'Earbuds': 'from-yellow-400 to-yellow-600',
  'Powerbank': 'from-teal-400 to-teal-600',
  'Charger': 'from-orange-400 to-orange-600',
  'Kabel': 'from-cyan-400 to-cyan-600',
  'Casing': 'from-lime-400 to-lime-600',
  'Monitor': 'from-violet-400 to-violet-600',
  'Keyboard': 'from-fuchsia-400 to-fuchsia-600',
  'Mouse': 'from-rose-400 to-rose-600',
  'Webcam': 'from-sky-400 to-sky-600',
  'Router': 'from-emerald-400 to-emerald-600',
  'SSD': 'from-amber-400 to-amber-600',
  'RAM': 'from-red-500 to-red-700',
  'VGA': 'from-purple-500 to-purple-700',
  'Aksesoris': 'from-gray-400 to-gray-600',
};

const CategoryCard = ({ name, productCount }) => {
  const categorySlug = name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  const emoji = categoryEmoji[name] || '📦';
  const gradient = categoryGradient[name] || 'from-gray-400 to-gray-600';

  return (
    <Link to={`/category/${categorySlug}`} className="block group">
      <div className={`relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br ${gradient} shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
          <div className="text-3xl md:text-4xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
          <p className="text-xs md:text-sm font-bold text-center drop-shadow-lg leading-tight">{name}</p>
          {productCount > 0 && (
            <p className="text-[10px] mt-0.5 opacity-90">{productCount}</p>
          )}
        </div>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 rounded-lg aspect-square"></div>
    <div className="mt-2 h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
  </div>
);

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch semua kategori dari API
        const categoriesResponse = await axios.get('http://localhost:5000/api/products/categories');

        // Fetch semua produk untuk menghitung jumlah per kategori
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const products = productsResponse.data;

        // Hitung jumlah produk per kategori
        const categoriesWithCount = categoriesResponse.data.map(categoryName => {
          const count = products.filter(p => p.category === categoryName).length;
          return {
            name: categoryName,
            productCount: count
          };
        });

        // Filter kategori yang memiliki produk dan ambil maksimal 8 kategori untuk featured
        const filteredCategories = categoriesWithCount
          .filter(cat => cat.productCount > 0)
          .sort((a, b) => b.productCount - a.productCount) // Sort by product count descending
          .slice(0, 8); // Ambil 8 kategori teratas

        setCategories(filteredCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Gagal memuat kategori');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🔥</span> Kategori Pilihan
        </h2>
        {!loading && categories.length > 0 && (
          <Link
            to="/categories"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Lihat Semua →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {loading ? (
          // Skeleton loading
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Belum ada kategori dengan produk
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              productCount={category.productCount}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedCategories;