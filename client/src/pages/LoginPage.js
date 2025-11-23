// client/src/pages/LoginPage.js
import React, { useState } from 'react'; // <-- 1. Import useState
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HelpModal from '../components/HelpModal'; // <-- 2. Import HelpModal

// Terima 'onLoginSuccess' dari App.js
const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // <-- 3. Tambah state modal
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Panggil API login
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // Kirim data user ke App.js
            onLoginSuccess(response.data);

            // Arahkan ke halaman utama setelah berhasil
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat masuk');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* 4. Render modal jika state-nya true */}
            {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} />}

            {/* --- Header Minimal --- */}
            <header className="py-4 px-6 md:px-12 border-b">
                <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo192.png" alt="Cikiwil Logo" className="h-8 w-8" />
                    <span className="text-2xl font-bold text-primary-text">Cikiwil Shop</span>
                </Link>
            </header>

            {/* --- Konten Utama (Form) --- */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Ilustrasi di kiri */}
                    <div className="text-center hidden md:block">
                        <img
                            src="/logo192.png" // Ilustrasi yang sama dengan halaman daftar
                            alt="Ilustrasi Belanja"
                            className="max-w-md mx-auto"
                        />
                        <h1 className="text-3xl font-bold mt-6">Selamat Datang Kembali</h1>
                        <p className="text-gray-600 mt-2">Masuk untuk melanjutkan aktivitas belanjamu.</p>
                    </div>

                    {/* Form di kanan */}
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-2">Masuk ke Cikiwil Shop</h2>
                        <p className="text-sm mb-6">
                            Belum punya akun?
                            <Link
                                to="/register"
                                className="text-primary font-bold ml-1"
                            >
                                Daftar
                            </Link>
                        </p>

                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                                    placeholder="E-mail"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            <div className="flex justify-end mb-4">
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Lupa Password?
                                </Link>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-yellow-400"
                            >
                                Masuk
                            </button>
                        </form>

                        {/* --- 5. UBAH <Link> MENJADI <button> --- */}
                        <button
                            type="button"
                            onClick={() => setIsHelpModalOpen(true)}
                            className="text-sm text-primary font-bold mt-4 block text-center w-full"
                        >
                            Butuh bantuan?
                        </button>
                    </div>
                </div>
            </main>

            {/* --- Footer Minimal --- */}
            <footer className="py-4 text-center text-gray-500 text-sm border-t">
                &copy; {new Date().getFullYear()} Cikiwil Shop.
            </footer>
        </div>
    );
};

export default LoginPage;