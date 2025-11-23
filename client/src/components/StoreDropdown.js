// client/src/components/StoreDropdown.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Ikon-ikon
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 0v-2a2 2 0 114 0v2m4 0v-2a2 2 0 10-4 0v2" /></svg>;


const StoreDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Jika user bukan seller atau tidak punya detail toko, jangan tampilkan apa-apa
    if (!user || user.role !== 'seller' || !user.storeDetails) {
        return null;
    }

    const { storeName, storeAvatarUrl } = user.storeDetails;

    // Tentukan URL logo toko (gunakan storeAvatarUrl sesuai backend)
    const logoUrl = storeAvatarUrl
        ? `http://localhost:5000${storeAvatarUrl}`
        : `https://i.pravatar.cc/40?u=${storeName || 'store'}`; // Placeholder jika logo belum ada

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
            >
                <img
                    src={logoUrl}
                    alt="Logo Toko"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                />
                <span className="hidden md:block font-semibold text-sm text-gray-700">{storeName || 'Toko Saya'}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border">
                    <div className="p-4 border-b">
                        <p className="font-bold text-gray-800 truncate">{storeName || 'Toko Saya'}</p>
                        <p className="text-sm text-primary font-bold">Penjual</p>
                    </div>
                    <div className="py-2">
                        <Link
                            to="/seller/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <DashboardIcon />
                            Dashboard Penjual
                        </Link>
                        <Link
                            to={`/shop/${encodeURIComponent(storeName)}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <StoreIcon />
                            Lihat Halaman Toko
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreDropdown;