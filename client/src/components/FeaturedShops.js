import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStore, FaCheckCircle } from 'react-icons/fa';

const ShopCard = ({ shop }) => {
    return (
        <Link to={`/shop/${shop.storeName}`} className="block group">
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <img
                        src={shop.storeAvatarUrl || 'https://via.placeholder.com/150'}
                        alt={shop.storeName}
                        className="w-full h-full object-cover rounded-full border border-gray-100"
                    />
                    {shop.isOfficial && (
                        <FaCheckCircle className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full text-xs" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                        {shop.storeName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                        {shop.storeAddress || 'Online Shop'}
                    </p>
                </div>
            </div>
        </Link>
    );
};

const FeaturedShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/shop');
                // Ambil 10 toko untuk ditampilkan dengan scroll
                setShops(data.slice(0, 10));
            } catch (err) {
                console.error('Error fetching shops:', err);
                setError('Gagal memuat toko');
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-4 h-full border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <FaStore className="text-yellow-500" /> Toko Pilihan
                    </h2>
                </div>
                <div className="space-y-3 flex-1 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || shops.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 h-full border border-gray-100 flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <FaStore className="text-yellow-500" /> Toko Pilihan
                </h2>
                <Link
                    to="/shops"
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                    Lihat Semua →
                </Link>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
                {shops.map((shop) => (
                    <ShopCard key={shop._id} shop={shop} />
                ))}
            </div>

            {/* Gradient fade at bottom to indicate scrolling */}
            <div className="h-4 bg-gradient-to-t from-white to-transparent flex-shrink-0 -mt-4 pointer-events-none"></div>
        </div>
    );
};

export default FeaturedShops;
