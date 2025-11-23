import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

// Mapping gambar untuk setiap kategori (Sama dengan FeaturedCategories)
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
            <div className="relative overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-gray-100">
                <img
                    src={imageUrl}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                    <h3 className="text-lg font-bold text-center mb-1 drop-shadow-md tracking-wide">{name}</h3>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-medium border border-white/10">
                        {productCount} Produk
                    </span>
                </div>
            </div>
        </Link>
    );
};



const AllCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categoriesResponse = await axios.get('http://localhost:5000/api/products/categories');
                const productsResponse = await axios.get('http://localhost:5000/api/products');
                const products = productsResponse.data;

                const categoriesWithCount = categoriesResponse.data.map(categoryName => {
                    const count = products.filter(p => p.category === categoryName).length;
                    return {
                        name: categoryName,
                        productCount: count
                    };
                });

                // Filter kategori yang memiliki produk dan sort alfabetis
                const filteredCategories = categoriesWithCount
                    .filter(cat => cat.productCount > 0)
                    .sort((a, b) => a.name.localeCompare(b.name));

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

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Semua Kategori</h1>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    Jelajahi berbagai koleksi produk elektronik terbaik kami berdasarkan kategori.
                </p>

                {/* Search Bar */}
                <div className="max-w-md mx-auto relative">
                    <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
                    />
                    <FaSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">Kategori tidak ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredCategories.map((category) => (
                        <CategoryCard
                            key={category.name}
                            name={category.name}
                            productCount={category.productCount}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllCategoriesPage;
