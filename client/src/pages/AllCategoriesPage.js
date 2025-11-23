import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Mapping emoji untuk setiap kategori (sama seperti di FeaturedCategories)
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <div className="text-5xl md:text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                        {emoji}
                    </div>
                    <p className="text-sm md:text-base font-bold text-center drop-shadow-lg">{name}</p>
                    {productCount > 0 && (
                        <p className="text-xs mt-1 opacity-90">{productCount} produk</p>
                    )}
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
        </Link>
    );
};

const AllCategoriesPage = () => {
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

                // Filter kategori yang memiliki produk dan sort berdasarkan nama
                const filteredCategories = categoriesWithCount
                    .filter(cat => cat.productCount > 0)
                    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Semua Kategori</h1>
                <p className="text-gray-600">Jelajahi produk berdasarkan kategori</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-300 rounded-lg aspect-square"></div>
                            <div className="mt-2 h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 text-center">
                    {error}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl mb-2">Belum ada kategori dengan produk</p>
                    <p className="text-sm">Kategori akan muncul setelah produk ditambahkan</p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Ditemukan {categories.length} kategori
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.name}
                                name={category.name}
                                productCount={category.productCount}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AllCategoriesPage;
