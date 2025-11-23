import React from 'react';
import { Link } from 'react-router-dom';

const HelpModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-6 text-center">Butuh bantuan apa?</h2>

                <div className="space-y-3">
                    <Link
                        to="/forgot-password" // Nanti Anda bisa buat halaman ini
                        onClick={onClose} // Tutup modal saat link diklik
                        className="block w-full text-center border border-gray-300 rounded-lg py-3 px-4 font-semibold hover:bg-gray-50"
                    >
                        Lupa kata sandi?
                    </Link>
                    <Link
                        to="/help-phone" // Nanti Anda bisa buat halaman ini
                        onClick={onClose} // Tutup modal saat link diklik
                        className="block w-full text-center border border-gray-300 rounded-lg py-3 px-4 font-semibold hover:bg-gray-50"
                    >
                        Nomor HP Tidak Aktif
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-6 text-center">
                    Butuh bantuan lain? Hubungi
                    <Link to="/help" onClick={onClose} className="text-primary font-bold ml-1">
                        Cikiwil Care
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default HelpModal;