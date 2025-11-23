// client/src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // <-- 1. IMPORT TOAST

// --- 2. HAPUS KOMPONEN SuccessNotification (sudah tidak dipakai) ---

const RegisterPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer', 
  });
  const [error, setError] = useState(''); // Kita masih bisa pakai ini untuk error inline
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true); // Mulai loading

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setLoading(false); // Stop loading
      return;
    }

    try {
      const newUser = {
        name,
        email,
        password,
      };
      const response = await axios.post('http://localhost:5000/api/auth/register', newUser);
      
      onLoginSuccess(response.data);

      // --- 3. GANTI NOTIFIKASI LAMA DENGAN TOAST ---
      toast.success('Pendaftaran berhasil! Mengarahkan ke halaman utama...');
      
      setTimeout(() => {
        navigate('/'); 
      }, 2000); // Tunggu 2 detik agar toast terbaca

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Terjadi kesalahan saat mendaftar';
      setError(errorMsg); // Tampilkan error inline di form
      toast.error(errorMsg); // Tampilkan toast error juga
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Minimal */}
      <header className="py-4 px-6 md:px-12 border-b">
        <Link to="/" className="flex items-center space-x-2">
            <img src="/logo192.png" alt="Cikiwil Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-primary-text">Cikiwil Shop</span>
        </Link>
      </header>

      {/* Konten Utama (Form) */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="text-center hidden md:block">
            <img 
              src="/logo192.png" 
              alt="Ilustrasi Belanja" 
              className="max-w-md mx-auto"
            />
            <h1 className="text-3xl font-bold mt-6">Jual Beli Mudah Hanya di Cikiwil Shop</h1>
            <p className="text-gray-600 mt-2">Gabung dan rasakan kemudahan bertransaksi di Cikiwil Shop</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">Daftar Sekarang</h2>
            <p className="text-sm mb-6">
              Sudah punya akun?
              <Link 
                to="/login"
                className="text-primary font-bold ml-1"
              >
                Masuk
              </Link>
            </p>
            
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <input 
                  type="text" 
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
              <div className="mb-4">
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={onChange}
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
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                  placeholder="Konfirmasi Password"
                  required
                />
              </div>
              
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:bg-gray-400"
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Dengan mendaftar, saya menyetujui<br/>
              <Link to="/terms" className="text-primary font-bold">Syarat & Ketentuan</Link> serta <Link to="/privacy-policy" className="text-primary font-bold">Kebijakan Privasi Cikiwil Shop</Link>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="py-4 text-center text-gray-500 text-sm border-t">
         &copy; {new Date().getFullYear()} Cikiwil Shop.
      </footer>
    </div>
  );
};

export default RegisterPage;