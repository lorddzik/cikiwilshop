import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStore, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const ShopCard = ({ shop }) => {
    return (
        <Link to={`/shop/${shop.storeName}`} className="block group h-full">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-300 h-full hover:-translate-y-1">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                        src={shop.storeAvatarUrl || 'https://via.placeholder.com/150'}
                        alt={shop.storeName}
                        className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm"
                    />
                    {shop.isOfficial && (
                        <FaCheckCircle className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full text-lg border-2 border-white" />
                    )}
                </div>
                <div className="text-center w-full">
                    <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors mb-1">
                        {shop.storeName}
                    </h3>
                    <div className="flex items-center justify-center text-gray-500 text-sm gap-1">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span className="truncate max-w-[150px]">{shop.storeAddress || 'Online Shop'}</span>
                    </div>
                </div>
                <button className="mt-auto w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    Kunjungi Toko
                </button>
            </div>
        </Link>
    );
};

const AllShopsPage = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchShops = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/shop');
                setShops(data);
            } catch (err) {
                console.error('Error fetching shops:', err);
                setError('Gagal memuat daftar toko');
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    const filteredShops = shops.filter(shop =>
        shop.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Semua Toko</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Temukan berbagai toko pilihan dengan produk berkualitas terbaik untuk kebutuhan Anda.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-10 relative">
                <input
                    type="text"
                    placeholder="Cari nama toko..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse h-64">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                            <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 text-center max-w-lg mx-auto">
                    <p className="font-semibold">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm underline hover:text-red-800"
                    >
                        Coba lagi
                    </button>
                </div>
            ) : filteredShops.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FaStore className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600 mb-2">Toko tidak ditemukan</p>
                    <p className="text-gray-500">Coba kata kunci pencarian lain</p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-500 font-medium">
                        Menampilkan {filteredShops.length} toko
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredShops.map((shop) => (
                            <ShopCard key={shop._id} shop={shop} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AllShopsPage;
