import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Mapping gambar untuk setiap kategori (Unsplash Source)
const categoryImages = {
  'Smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
  'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80',
  'Tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80',
  'Smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
  'Headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
  'Speaker': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80',
  'Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
  'Powerbank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=300&q=80',
  'Charger': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80',
  'Kabel': 'https://images.unsplash.com/photo-1542382256769-2571632217ef?auto=format&fit=crop&w=300&q=80',
  'Casing': 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=300&q=80',
  'Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80',
  'Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=300&q=80',
  'Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80',
  'Webcam': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
  'Router': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80',
  'SSD': 'https://images.unsplash.com/photo-1597872252165-4827c926875d?auto=format&fit=crop&w=300&q=80',
  'RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=300&q=80',
  'VGA': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=300&q=80',
  'Aksesoris': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80',
};

const CategoryCard = ({ name, productCount }) => {
  const categorySlug = name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  const imageUrl = categoryImages[name] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80';

  return (
    <Link to={`/category/${categorySlug}`} className="block group">
      <div className="relative overflow-hidden rounded-xl aspect-square shadow-sm hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
        {/* Background Image */}
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-3 text-white">
          <p className="text-sm md:text-base font-bold text-center drop-shadow-md tracking-wide mb-1">{name}</p>
          {productCount > 0 && (
            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {productCount} Produk
            </span>
          )}
        </div>
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

        // Fetch semua produk untuk menghitung jumlah per kategori
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const products = productsResponse.data;

        // Gunakan list kategori dari categoryImages sebagai source of truth
        const allCategories = Object.keys(categoryImages);

        // Hitung jumlah produk per kategori
        const categoriesWithCount = allCategories.map(categoryName => {
          const count = products.filter(p => p.category === categoryName).length;
          return {
            name: categoryName,
            productCount: count
          };
        });

        setCategories(categoriesWithCount);
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
    </div >
  );
};

export default FeaturedCategories;